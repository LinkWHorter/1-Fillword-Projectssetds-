// script.js
document.getElementById('createTable').addEventListener('click', createTable);
document.getElementById('clearTable').addEventListener('click', clearTable);
document.getElementById('autoFill').addEventListener('click', autoFillEmptyCells);
document.addEventListener('keypress', handleKeyPress);
document.addEventListener('mousedown', handleMouseDownOutsideTable);

let currentCellIndex = 0;
let cells = [];
let selectedCells = [];
let isMouseDown = false;
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
}

function handleKeyPress(event) {
    const char = event.key;
    if (!/^[а-яА-ЯёЁ]$/.test(char)) return;

    const targetCell = selectedCells.length > 0 ? selectedCells.shift() : cells[currentCellIndex++];
    if (targetCell) {
        targetCell.textContent = char;
        if (!selectedCells.includes(targetCell)) {
            selectedCells.push(targetCell);
        }
    }
}

function clearCell(cell) {
    cell.textContent = '';
    cell.classList.remove('selected');
    selectedCells = selectedCells.filter(selectedCell => selectedCell !== cell);
}

function clearTable() {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';
    cells = [];
    selectedCells = [];
    currentCellIndex = 0;
}

function clearSelectedCells() {
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
}

function autoFillEmptyCells() {
    const alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    cells.forEach(cell => {
        if (!cell.textContent) {
            const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
            cell.textContent = randomChar;
        }
    });
}