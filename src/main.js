import './style.css';

/* Constants */
const ROWS = 3;
const COLS = 3;
const PLAYERS = ['x', 'o'];
const WINNING_COMBINATIONS = [
		/* Rows */
		[0, 1, 2], [3, 4, 5], [6, 7, 8],
		/* Columns */
		[0, 3, 6], [1, 4, 7],	[2, 5, 8],
		/* Diagonals */
		[0, 4, 8], [2, 4, 6]
]

/* Utility Functions */
function createCell() {
	const CellElement = document.createElement('span');
	CellElement.classList.add('cell');
	CellElement.value = null;
	return CellElement;
}

function resetCell(cell) {
	cell.classList.remove(...PLAYERS.map(player => 'player-' + player));
	cell.textContent = '';
	cell.value = null;
}

function registerCellEvents(board, cell) {
	cell.addEventListener('mouseenter', () => {
		if (cell.value !== null) return;
		cell.textContent = PLAYERS[Turn];
	});

	cell.addEventListener('mouseleave', () => {
		if (cell.value !== null) return;
		cell.textContent = '';
	});

	cell.addEventListener('click', () => {
		if (cell.value !== null) return;
		cell.classList.add('player-' + PLAYERS[Turn]);
		cell.value = PLAYERS[Turn];

		for (let index in PLAYERS) {
			const player = PLAYERS[index];
			if (checkWinner(board, player)) {
				displayOverlay(`Player ${Number.parseInt(index)+1} wins!`, () => {
					Scoreboard[player]++;
					updateScoreDisplay();
					resetBoard(board);
				});
				break;
			}
		}

		if (checkDraw(board)) {
			displayOverlay('Draw!', () => resetBoard(board));
		}

		Turn = ++Turn % 2;
	});
}

function createScoreboard(root) {
	const ScoreboardElement = document.createElement('div');
	ScoreboardElement.classList.add('scoreboard');

	const Score = Object.fromEntries(
			PLAYERS.map(player => [player, 0])
	);

	Object.keys(Score).forEach((player, index) => {
		const PlayerNameElement = document.createElement('span');
		PlayerNameElement.classList.add('score', 'player-' + player);
		PlayerNameElement.textContent = `Player ${index+1}`;
		const ScoreElement = document.createElement('p');
		ScoreElement.textContent = Score[player].toString();
		ScoreElement.id = `${player}-score`;

		PlayerNameElement.appendChild(ScoreElement);
		ScoreboardElement.appendChild(PlayerNameElement);
	})

	const ResetButton = document.createElement('button');
	ResetButton.classList.add('reset');
	ResetButton.addEventListener('click', () => {
		Object.keys(Score).forEach(player => Score[player] = 0);
		updateScoreDisplay();
		resetBoard(Board);
		Turn = 0;
	});
	ScoreboardElement.insertBefore(ResetButton, ScoreboardElement.lastChild);

	root.appendChild(ScoreboardElement);
	return Score;
}

function updateScoreDisplay() {
	Object.entries(Scoreboard).forEach(([player, score]) => {
		const ScoreElement = document.getElementById(`${player}-score`);
		ScoreElement.textContent = score.toString();
	});
}

function displayOverlay(message, onDismiss) {
	const OverlayElement = document.querySelector('#overlay');
	OverlayElement.classList.add('visible');

	const RoundCount = Object.values(Scoreboard).reduce((acc, cur) => acc + cur, 1);
	OverlayElement.querySelector('#round').textContent = RoundCount.toString();
	OverlayElement.querySelector('#message').textContent = message;

	OverlayElement.addEventListener('click', () => {
		OverlayElement.classList.remove('visible');
		onDismiss();
	}, {once: true});
}

function createBoard(root) {
	const BoardElement = document.createElement('div');
	BoardElement.classList.add('board');

	const Board = new Array(ROWS * COLS).fill(null).map(createCell);
	Board.forEach(cell => registerCellEvents(Board, cell));

	BoardElement.append(...Board);
	root.appendChild(BoardElement);
	return Board;
}

function resetBoard(board) {
	board.forEach(resetCell);
}

function checkWinner(board, player) {
	const values = board.map(cell => cell.value);
	for (let combination of WINNING_COMBINATIONS) {
		if (combination.every(index => values[index] === player))
			return true;
	}
	return false;
}

function checkDraw(board) {
	return board.every(cell => cell.value !== null);
}

/* Main */
const GameContainer = document.querySelector('#game');
const Scoreboard = createScoreboard(GameContainer);
const Board = createBoard(GameContainer);
let Turn = 0; /* 0 = 'x', 1 = 'o' */