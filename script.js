// script.js
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
            checkSolution();
        }
    }

    function generateSudoku() {
        const puzzle = createSudokuPuzzle();
        puzzle.forEach((value, index) => {
            const cell = sudokuGrid.children[index];
            if (value !== 0) {
                cell.textContent = value;
                cell.contentEditable = false; // Lock the initial cells
                cell.classList.add('initial');
            }
        });
    }

    function createSudokuPuzzle() {
        // Simple Sudoku puzzle generator (for demo purposes)
        const basePuzzle = [
            5, 3, 0, 0, 7, 0, 0, 0, 0,
            6, 0, 0, 1, 9, 5, 0, 0, 0,
            0, 9, 8, 0, 0, 0, 0, 6, 0,
            8, 0, 0, 0, 6, 0, 0, 0, 3,
            4, 0, 0, 8, 0, 3, 0, 0, 1,
            7, 0, 0, 0, 2, 0, 0, 0, 6,
            0, 6, 0, 0, 0, 0, 2, 8, 0,
            0, 0, 0, 4, 1, 9, 0, 0, 5,
            0, 0, 0, 0, 8, 0, 0, 7, 9,
        ];
        return basePuzzle;
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
                // Check rows
                const rowIndex = i * size + j;
                if (gridValues[rowIndex] !== '0' && row.has(gridValues[rowIndex])) return false;
                row.add(gridValues[rowIndex]);

                // Check columns
                const colIndex = j * size + i;
                if (gridValues[colIndex] !== '0' && col.has(gridValues[colIndex])) return false;
                col.add(gridValues[colIndex]);

                // Check 3x3 boxes
                const boxRowIndex = Math.floor(i / boxSize) * boxSize + Math.floor(j / boxSize);
                const boxColIndex = (i % boxSize) * boxSize + (j % boxSize);
                const boxIndex = boxRowIndex * size + boxColIndex;
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
