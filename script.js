// script.js (continued)
document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudoku-grid');
    const undoButton = document.getElementById('undo-button');
    const redoButton = document.getElementById('redo-button');
    const hintButton = document.getElementById('hint-button');

    let moveCount = 0;
    let timerInterval;
    const startTime = new Date();

    const undoStack = [];
    const redoStack = [];

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
        // Placeholder for getting the correct value (should be based on the solution)
        // For demo purposes, we'll assume this is the correct value.
        return '1'; // Replace with actual logic to retrieve correct value
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
    loadGameState();
});
