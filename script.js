// script.js
document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudoku-grid');

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
        }
    }
});
