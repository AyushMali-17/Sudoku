// script.js (continued)
document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudoku-grid');
    let moveCount = 0;
    let timerInterval;
    const startTime = new Date();

    // Create the 9x9 grid elements
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.contentEditable = true; // Allow user input
        cell.dataset.index = i; // Store the cell index
        cell.addEventListener('input', handleInput);
        cell.addEventListener('focus', handleFocus);
        cell.addEventListener('blur', handleBlur);
        sudokuGrid.appendChild(cell);
    }

    function handleInput(event) {
        const cell = event.target;
        const value = cell.textContent.trim();

        // Basic validation: check if the value is a number between 1 and 9
        if (!/^[1-9]$/.test(value)) {
            cell.textContent = ''; // Clear invalid input
        } else {
            moveCount++;
            updateMoveCounter();
            highlightSimilarNumbers(value);
            checkConflicts();
            checkSolution();
        }
    }

    function handleFocus(event) {
        const value = event.target.textContent.trim();
        if (value) {
            highlightSimilarNumbers(value);
        }
    }

    function handleBlur() {
        clearHighlighting();
    }

    function highlightSimilarNumbers(value) {
        clearHighlighting();
        const cells = [...sudokuGrid.children];
        cells.forEach(cell => {
            if (cell.textContent.trim() === value) {
                cell.style.backgroundColor = '#f39c12';
                cell.style.color = '#ecf0f1';
            }
        });
    }

    function clearHighlighting() {
        const cells = [...sudokuGrid.children];
        cells.forEach(cell => {
            if (!cell.classList.contains('initial')) {
                cell.style.backgroundColor = '';
                cell.style.color = '#2c3e50';
            }
        });
    }

    function checkConflicts() {
        const cells = [...sudokuGrid.children];
        const gridValues = cells.map(cell => cell.textContent.trim() || '0');

        clearInvalidCells();

        const size = 9;
        const boxSize = 3;

        for (let i = 0; i < size; i++) {
            const row = new Set();
            const col = new Set();
            const box = new Set();

            for (let j = 0; j < size; j++) {
                const rowIndex = i * size + j;
                const colIndex = j * size + i;
                const boxRowIndex = Math.floor(i / boxSize) * boxSize + Math.floor(j / boxSize);
                const boxColIndex = (i % boxSize) * boxSize + (j % boxSize);
                const boxIndex = boxRowIndex * size + boxColIndex;

                if (gridValues[rowIndex] !== '0' && row.has(gridValues[rowIndex])) markInvalid(rowIndex);
                row.add(gridValues[rowIndex]);

                if (gridValues[colIndex] !== '0' && col.has(gridValues[colIndex])) markInvalid(colIndex);
                col.add(gridValues[colIndex]);

                if (gridValues[boxIndex] !== '0' && box.has(gridValues[boxIndex])) markInvalid(boxIndex);
                box.add(gridValues[boxIndex]);
            }
        }
    }

    function markInvalid(index) {
        const cell = sudokuGrid.children[index];
        cell.classList.add('invalid');
    }

    function clearInvalidCells() {
        const cells = [...sudokuGrid.children];
        cells.forEach(cell => cell.classList.remove('invalid'));
    }

    function checkSolution() {
        const cells = [...sudokuGrid.children];
        const gridValues = cells.map(cell => cell.textContent.trim() || '0');

        if (isValidSudoku(gridValues)) {
            alert('Congratulations! You solved the puzzle!');
            clearInterval(timerInterval); // Stop the timer when solved
        }
    }

    function isValidSudoku(gridValues) {
        const size = 9;
        const boxSize = 3;

        for (let i = 0; i < size; i++) {
            const row = new Set();
            const col = new Set();
            const box = new Set();

            for (let j = 0; j < size; j++) {
                const rowIndex = i * size + j;
                const colIndex = j * size + i;
                const boxRowIndex = Math.floor(i / boxSize) * boxSize + Math.floor(j / boxSize);
                const boxColIndex = (i % boxSize) * boxSize + (j % boxSize);
                const boxIndex = boxRowIndex * size + boxColIndex;

                if (gridValues[rowIndex] !== '0' && row.has(gridValues[rowIndex])) return false;
                row.add(gridValues[rowIndex]);

                if (gridValues[colIndex] !== '0' && col.has(gridValues[colIndex])) return false;
                col.add(gridValues[colIndex]);

                if (gridValues[boxIndex] !== '0' && box.has(gridValues[boxIndex])) return false;
                box.add(gridValues[boxIndex]);
            }
        }
        return true;
    }

    function updateTimer() {
        const now = new Date();
        const elapsedTime = Math.floor((now - startTime) / 1000);

        const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
        const seconds = String(elapsedTime % 60).padStart(2, '0');

        document.getElementById('timer').textContent = `Time: ${minutes}:${seconds}`;
    }

    function updateMoveCounter() {
        document.getElementById('move-counter').textContent = `Moves: ${moveCount}`;
    }

    function startTimer() {
        timerInterval = setInterval(updateTimer, 1000);
    }

    startTimer();
    generateSudoku();
});
