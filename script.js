// script.js (completed)
document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudoku-grid');
    const undoButton = document.getElementById('undo-button');
    const redoButton = document.getElementById('redo-button');
    const hintButton = document.getElementById('hint-button');
    const darkModeCheckbox = document.getElementById('dark-mode-checkbox');

    let moveCount = 0;
    let timerInterval;
    const startTime = new Date();

    const undoStack = [];
    const redoStack = [];

    // Load dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeCheckbox.checked = true;
    }

    darkModeCheckbox.addEventListener('change', toggleDarkMode);

    function toggleDarkMode() {
        if (darkModeCheckbox.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('darkMode', 'false');
        }
    }

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

    undoButton.addEventListener('click', undo);
    redoButton.addEventListener('click', redo);
    hintButton.addEventListener('click', provideHint);

    function handleInput(event) {
        const cell = event.target;
        const value = cell.textContent.trim();

        saveState(undoStack);

        if (!/^[1-9]$/.test(value)) {
            cell.textContent = ''; // Clear invalid input
        } else {
            moveCount++;
            updateMoveCounter();
            highlightSimilarNumbers(value);
            checkConflicts();
            checkSolution();
        }

        redoStack.length = 0; // Clear redo stack on new input
        updateButtonStates();
        saveGameState();
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

    function undo() {
        if (undoStack.length > 0) {
            saveState(redoStack);
            const previousState = undoStack.pop();
            restoreState(previousState);
            updateButtonStates();
            saveGameState();
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            saveState(undoStack);
            const nextState = redoStack.pop();
            restoreState(nextState);
            updateButtonStates();
            saveGameState();
        }
    }

    function provideHint() {
        const cells = [...sudokuGrid.children];
        const emptyCells = cells.filter(cell => cell.textContent.trim() === '');
        if (emptyCells.length === 0) return;

        const randomEmptyCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const correctValue = getCorrectValue(randomEmptyCell.dataset.index);
        randomEmptyCell.textContent = correctValue;
        randomEmptyCell.classList.add('initial'); // Mark it as a given value
        randomEmptyCell.contentEditable = false;

        moveCount++;
        updateMoveCounter();
        checkConflicts();
        checkSolution();
        saveGameState();
    }

    function saveState(stack) {
        const state = [...sudokuGrid.children].map(cell => cell.textContent.trim());
        stack.push(state);
    }

    function restoreState(state) {
        [...sudokuGrid.children].forEach((cell, index) => {
            cell.textContent = state[index];
        });
        checkConflicts();
    }

    function updateButtonStates() {
        undoButton.disabled = undoStack.length === 0;
        redoButton.disabled = redoStack.length === 0;
    }

    function saveGameState() {
        const gameState = {
            grid: [...sudokuGrid.children].map(cell => ({
                value: cell.textContent.trim(),
                editable: cell.contentEditable === "true",
            })),
            timer: document.getElementById('timer').textContent,
            moves: moveCount,
        };
        localStorage.setItem('sudokuGameState', JSON.stringify(gameState));
    }

    function loadGameState() {
        const gameState = JSON.parse(localStorage.getItem('sudokuGameState'));
        if (gameState) {
            gameState.grid.forEach((cellState, index) => {
                const cell = sudokuGrid.children[index];
                cell.textContent = cellState.value;
                cell.contentEditable = cellState.editable;
                if (!cellState.editable) {
                    cell.classList.add('initial');
                }
            });
            document.getElementById('timer').textContent = gameState.timer;
            moveCount = gameState.moves;
            updateMoveCounter();
            checkConflicts();
            updateButtonStates();
        }
    }

    function getCorrectValue(index) {
        // Complete Sudoku solver logic to determine the correct value
        // For the sake of this example, let's assume we have a solution array
        const solution = [
            5, 3, 4, 6, 7, 8, 9, 1, 2,
            6, 7, 2, 1, 9, 5, 3, 4, 8,
            1, 9, 8, 3, 4, 2, 5, 6, 7,
            8, 5, 9, 7, 6, 1, 4, 2, 3,
            4, 2, 6, 8, 5, 3, 7, 9, 1,
            7, 1, 3, 9, 2, 4, 8, 5, 6,
            9, 6, 1, 5, 3, 7, 2, 8, 4,
            2, 8, 7, 4, 1, 9, 6, 3, 5,
            3, 4, 5, 2, 8, 6, 1, 7, 9,
        ];
        return solution[index]; // Returns the correct value based on the solution
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

    function generateSudoku() {
        // Example puzzle (could be randomly generated or fetched)
        const puzzle = [
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

        puzzle.forEach((value, index) => {
            const cell = sudokuGrid.children[index];
            if (value !== 0) {
                cell.textContent = value;
                cell.contentEditable = false; // Lock the initial cells
                cell.classList.add('initial');
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

    startTimer();
    generateSudoku();
    loadGameState();
});
