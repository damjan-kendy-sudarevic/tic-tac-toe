import './style.css';

/* Constants */
const ROWS = 3;
const COLS = 3;

/* Utility Functions */
function createCell() {
	const CellElement = document.createElement('span');
	CellElement.classList.add('cell');
	CellElement.value = null;
	return CellElement;
}

function createBoard(root) {
	const BoardElement = document.createElement('div');
	BoardElement.classList.add('board');

	const Board = new Array(ROWS * COLS).fill(null).map(createCell);
	Board.forEach(cell => BoardElement.appendChild(cell));

	root.appendChild(BoardElement);
	return Board;
}

/* Main */
const GameContainer = document.querySelector('#game');
const Board = createBoard(GameContainer);
console.log(Board);