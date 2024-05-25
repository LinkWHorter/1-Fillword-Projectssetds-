// script.js
document.getElementById('createTable').addEventListener('click', createTable);
document.getElementById('clearTable').addEventListener('click', clearTable);
document.getElementById('autoFill').addEventListener('click', autoFillEmptyCells);
document.getElementById('tableDataInput').addEventListener('input', handleInputChange);
document.getElementById('tableDataInput').addEventListener('focus', () => { isInputActive = true; });
document.getElementById('tableDataInput').addEventListener('blur', () => { isInputActive = false; updateInputFromTable(); });
document.getElementById('copyToClipboard').addEventListener('click', copyToClipboard);
document.getElementById('pasteFromClipboard').addEventListener('click', pasteFromClipboard);
document.getElementById('downloadImage').addEventListener('click', downloadTableImage);
document.addEventListener('keypress', handleKeyPress);
document.addEventListener('mousedown', handleMouseDownOutsideTable);
document.getElementById('En-select').addEventListener('click', ENletting);

let currentCellIndex = 0;
let cells = [];
let selectedCells = [];
let isMouseDown = false;
let isInputActive = false;
let isRightMouseDown = false;

function createTable() {
    const size = parseInt(document.getElementById('sizeInput').value);
    if (isNaN(size) || size < 1) {
        alert('Введите корректное число больше 0');
        return;
    }

    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';

    const table = document.createElement('table');
    cells = [];
    selectedCells = [];

    for (let i = 0; i < size; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            const td = document.createElement('td');
            td.addEventListener('click', () => toggleCellSelection(td));
            td.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                clearCell(td);
            });
            td.addEventListener('mousedown', (event) => {
                if (event.button === 0) {
                    isMouseDown = true;
                    toggleCellSelection(td);
                } else if (event.button === 2) {
                    isRightMouseDown = true;
                    toggleCellSelection(td, false);
                }
            });
            td.addEventListener('mouseenter', () => {
                if (isMouseDown) {
                    toggleCellSelection(td);
                } else if (isRightMouseDown) {
                    toggleCellSelection(td, false);
                }
            });
            tr.appendChild(td);
            cells.push(td);
        }
        table.appendChild(tr);
    }
    tableContainer.appendChild(table);
    currentCellIndex = 0; // Reset the index for filling cells

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
        isRightMouseDown = false;
    });

    updateInputFromTable(); // Обновляем данные в инпуте после создания таблицы
}

function handleMouseDownOutsideTable(event) {
    const tableContainer = document.getElementById('tableContainer');
    if (!tableContainer.contains(event.target)) {
        clearSelectedCells();
    }
}

function toggleCellSelection(cell, select = true) {
    if (select) {
        cell.classList.add('selected');
        if (!selectedCells.includes(cell)) {
            selectedCells.push(cell);
        }
    } else {
        cell.classList.remove('selected');
        selectedCells = selectedCells.filter(selectedCell => selectedCell !== cell);
    }
    updateInputFromTable(); // Обновляем данные в инпуте после создания таблицы
}

function handleKeyPress(event) {
    const char = event.key;
    if (!/^[а-яА-ЯёЁa-zA-Z0-9]$/.test(char)) return;

    const targetCell = selectedCells.length > 0 ? selectedCells.shift() : cells[currentCellIndex++];
    if (targetCell) {
        targetCell.textContent = char;
        if (!selectedCells.includes(targetCell)) {
            selectedCells.push(targetCell);
        }
    }
    if (!isInputActive) {
        updateInputFromTable(); // Обновляем данные в инпуте при вводе символов, если input не активен
    }
}

function clearCell(cell) {
    cell.textContent = '';
    cell.classList.remove('selected');
    selectedCells = selectedCells.filter(selectedCell => selectedCell !== cell);
    updateInputFromTable(); // Обновляем данные в инпуте после очистки ячейки
}

function clearTable() {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';
    cells = [];
    selectedCells = [];
    currentCellIndex = 0;
    updateInputFromTable(); // Обновляем данные в инпуте после очистки таблицы
}

function clearSelectedCells() {
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
}

let isENlangu = false;

function ENletting() {
    isENlangu = !isENlangu;
    const ENselect = document.getElementById('En-select');

    if (isENlangu) {ENselect.innerHTML = 'RU';}
    else {ENselect.innerHTML = 'EN';}
}

function autoFillEmptyCells() {
    if (!isENlangu)
    { const alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'; 
    cells.forEach(cell => {
        if (!cell.textContent) {
            const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
            cell.textContent = randomChar;
        }
    });
    updateInputFromTable(); // Обновляем данные в инпуте после автозаполнения ячеек
    }

    else if (isENlangu)
    { const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    cells.forEach(cell => {
        if (!cell.textContent) {
            const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
            cell.textContent = randomChar;
        }
    });
    updateInputFromTable(); // Обновляем данные в инпуте после автозаполнения ячеек
    }
}

function downloadTableImage() {
    const tableContainer = document.getElementById('tableContainer');
    
    // Используем html2canvas для создания изображения
    html2canvas(tableContainer, {
        scale: 15, // Увеличиваем разрешение в 15 раз
        onrendered: function(canvas) {
            canvas.toBlob(function(blob) {
                // Создаем ссылку на Blob
                const url = window.URL.createObjectURL(blob);

                // Создаем ссылку для скачивания
                const link = document.createElement('a');
                link.download = 'table.png';
                link.href = url;

                // Добавляем ссылку на страницу и эмулируем клик
                document.body.appendChild(link);
                link.click();

                // Удаляем ссылку из DOM
                document.body.removeChild(link);

                // Освобождаем ресурсы Blob
                window.URL.revokeObjectURL(url);
            });
        }
    });
}

// Инициализируем переменную для отслеживания текущей темы (светлая/темная)
let isDarkTheme = false;

// Добавляем обработчик событий для кнопки переключения темы
document.getElementById('toggleTheme').addEventListener('click', toggleTheme);

// Функция для переключения темы всех таблиц на сайте
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    const tables = document.querySelectorAll('table'); // Получаем все элементы таблиц на странице
    const toggleButton = document.getElementById('toggleTheme'); // Получаем элемент кнопки для переключения темы
    
    // Если тема темная, устанавливаем темные стили
    if (isDarkTheme) {
        tables.forEach(table => {
            table.style.backgroundColor = 'black'; // Устанавливаем черный фон таблицы
            table.querySelectorAll('td').forEach(cell => {
                if (!cell.classList.contains('selected')) {
                    cell.style.backgroundColor = 'black'; // Устанавливаем черный фон ячеек
                    cell.style.color = 'white'; // Устанавливаем белый текст в ячейках
                    cell.style.borderColor = 'white'; // Устанавливаем белые границы ячеек
                }
            });
        });
        toggleButton.style.backgroundColor = '#f0f0f0'; // Устанавливаем белый фон кнопки
        toggleButton.style.color = 'black'; // Устанавливаем черный текст кнопки
    } else { // Если тема светлая, устанавливаем светлые стили
        tables.forEach(table => {
            table.style.backgroundColor = 'white'; // Устанавливаем белый фон таблицы
            table.querySelectorAll('td').forEach(cell => {
                if (!cell.classList.contains('selected')) {
                    cell.style.backgroundColor = 'white'; // Устанавливаем белый фон ячеек
                    cell.style.color = 'black'; // Устанавливаем черный текст в ячейках
                    cell.style.borderColor = 'darkgray'; // Устанавливаем черные границы ячеек
                }
            });
        });
        toggleButton.style.backgroundColor = 'gray'; // Устанавливаем черный фон кнопки
        toggleButton.style.color = 'white'; // Устанавливаем белый текст кнопки
    }
}

function updateInputFromTable() {
    const size = cells.length ? Math.sqrt(cells.length) : 0;
    let data = `{${size};`;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = cells[i * size + j];
            const char = cell.textContent || '_';
            data += char.toLowerCase() + (j < size - 1 ? ',' : '');
        }
        data += i < size - 1 ? ';' : '';
    }
    data += '}';
    document.getElementById('tableDataInput').value = data;
}

function updateTableFromInput() {
    if (!isInputActive) return;
    const inputData = document.getElementById('tableDataInput').value;
    const match = inputData.match(/^\{(\d+);(.+)\}$/);
    if (!match) return;

    const size = parseInt(match[1]);
    const rows = match[2].split(';');

    if (isNaN(size) || rows.length !== size) return;

    createTable(); // Пересоздаем таблицу, если размер изменился
    cells = [];
    selectedCells = [];

    for (let i = 0; i < size; i++) {
        const row = rows[i].split(',');
        for (let j = 0; j < size; j++) {
            const cell = document.querySelectorAll('table tr')[i].cells[j];
            cell.textContent = row[j] === '_' ? '' : row[j].toUpperCase();
            cells.push(cell);
        }
    }
}

function copyToClipboard() {
    const tableDataInput = document.getElementById('tableDataInput');
    tableDataInput.select();
    document.execCommand('copy');
}

function handleInputChange() {
    if (isInputActive) {
        updateTableFromInput(); // Обновляем таблицу при изменении данных в инпуте, если input активен
        updateInputFromTable(); // Сразу обновляем данные в инпуте после обновления таблицы
    }
}

function pasteFromClipboard() {
    navigator.clipboard.readText().then(text => {
        const match = text.match(/^\{(\d+);(.+)\}$/);
        if (match) {
            const size = parseInt(match[1]);
            if (!isNaN(size)) {
                document.getElementById('sizeInput').value = size; // Устанавливаем размер в input #sizeInput
                createTable(); // Пересоздаем таблицу с новым размером
                document.getElementById('tableDataInput').value = text; // Устанавливаем текст в input #tableDataInput
                isInputActive = true;
                handleInputChange(); // Обновляем таблицу на основе данных из input #tableDataInput
                isInputActive = false;
            } else {
                alert('Некорректный формат данных для вставки.');
            }
        } else {
            alert('Некорректный формат данных для вставки.');
        }
    }).catch(err => {
        console.error('Failed to read clipboard contents: ', err);
    });
}