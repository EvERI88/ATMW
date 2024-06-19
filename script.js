document.addEventListener('DOMContentLoaded', function() {
    // Получаем ссылки на элементы интерфейса
    var startValueInput = document.getElementById('startValue');
    var incrementInput = document.getElementById('increment');
    var textInput = document.getElementById('textInput');
    var pasteBtn = document.getElementById('pasteBtn');
    var processBtn = document.getElementById('processBtn');
    var removeBracesBtn = document.getElementById('removeBracesBtn');
    var addBracesBtn = document.getElementById('addBracesBtn'); // Новая кнопка
    var addBracesToAddressBtn = document.getElementById('addBracesToAddressBtn'); // Кнопка для добавления скобок к адресам
    var statusMsg = document.getElementById('statusMsg');
    var updatedText = document.getElementById('updatedText');
    var copyBtn = document.getElementById('copyBtn');

    // Функция для обновления тегов
    function updateTags(startValue, increment, text) {
        var lines = text.split('\n');
        var new_text = '';
        var current_value = startValue;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var match = line.match(/AT %MW(\d+)/);

            if (match) {
                var new_line = line.replace(match[1], current_value.toString().padStart(match[1].length, '0'));
                current_value += increment;
                new_text += new_line + '\n';
            } else {
                new_text += line + '\n';
            }
        }

        return new_text;
    }

    // Функция для удаления фигурных скобок
    function removeBraces(text) {
        return text.replace(/{|}/g, '');
    }

    // Функция для добавления фигурных скобок вокруг "AT %MW..."
    function addBraces(text) {
        return text.replace(/(AT %MW\d+)/g, '{$1}');
    }

    // Функция для добавления фигурных скобок вокруг адресов
    function addBracesToAddresses(text) {
        // Регулярное выражение для поиска адресов (упрощённый пример)
        var addressRegex = /\b\d{1,3}\s\w+\s(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Lane|Ln)\b/g;
        return text.replace(addressRegex, (match) => `{${match}}`);
    }

    // Функция для вставки текста из буфера обмена
    pasteBtn.addEventListener('click', function() {
        navigator.clipboard.readText()
            .then(text => {
                textInput.value = text;
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
    });
    

    // Функция для обработки текста
    processBtn.addEventListener('click', function() {
        var startValue = parseInt(startValueInput.value);
        var increment = parseInt(incrementInput.value);
        var text = textInput.value;

        if (!isNaN(startValue) && !isNaN(increment)) {
            var updatedTextValue = updateTags(startValue, increment, text);
            updatedText.textContent = updatedTextValue;
            statusMsg.textContent = 'Текст успешно обработан';
        } else {
            statusMsg.textContent = 'Ошибка: Начальное значение и значение для увеличения должны быть числами';
        }
    });

    // Функция для удаления скобок и обновления текста
    removeBracesBtn.addEventListener('click', function() {
        var text = updatedText.textContent || textInput.value;
        var updatedTextValue = removeBraces(text);
        updatedText.textContent = updatedTextValue;
        statusMsg.textContent = 'Все скобки {} удалены';
    });

    // Функция для добавления скобок и обновления текста
    addBracesBtn.addEventListener('click', function() {
        var text = updatedText.textContent || textInput.value;
        var updatedTextValue = addBraces(text);
        updatedText.textContent = updatedTextValue;
        statusMsg.textContent = 'Скобки {} добавлены';
    });

    // Функция для добавления скобок к адресам и обновления текста
    addBracesToAddressBtn.addEventListener('click', function() {
        var text = updatedText.textContent || textInput.value;
        var updatedTextValue = addBracesToAddresses(text);
        updatedText.textContent = updatedTextValue;
        statusMsg.textContent = 'Скобки {} добавлены к адресам';
    });

    // Функция для копирования обработанного текста в буфер обмена
    copyBtn.addEventListener('click', function() {
        var range = document.createRange();
        range.selectNode(updatedText);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();

        statusMsg.textContent = 'Результат скопирован в буфер обмена';
    });
});
