import './style.css';
import {
	query as $,
	queryAll as $$
} from './util/query.js';

/* Constants */

const ROWS = 3;
const COLUMNS = 3;

const PLAYERS = [
	{
		name: 'Player 1',
		symbol: 'x',
		score: 0,
	},
	{
		name: 'Player 2',
		symbol: 'o',
		score: 0,
	}
];

const WINNING_COMBINATIONS = [
		/* Rows */
		[0, 1, 2], [3, 4, 5], [6, 7, 8],
		/* Columns */
		[0, 3, 6], [1, 4, 7],	[2, 5, 8],
		/* Diagonals */
		[0, 4, 8], [2, 4, 6]
]

/* Global variables */

let round = 1;
let turn = 0;
/*
	0 = Player 1 (x)
  1 = Player 2 (o)
 */

/* Functions */

function createCells(rows, cols) {
	return new Array(rows * cols).fill(null)
			.map(() => `<span class="cell"></span>`);
}

function resetCells() {
	const Cells = $$('.cell');
	Cells.forEach(Cell => {
		Cell.textContent = '';
		Cell.classList.remove(
				...PLAYERS.map(Player => `player-${Player.symbol}`)
		);
		attachCellEventHandlers(Cell);
	});
}

function resetGame() {
	PLAYERS.forEach((Player, i) => Player.name = `Player ${i+1}`);
	PLAYERS.forEach(Player => Player.score = 0);
	round = 1; turn = 0;
	resetCells();
	render();
}

function checkPlayerWin(player) {
	const BoardValue = [...$$('.cell')].map(Cell => Cell.textContent);
	for (let Combination of WINNING_COMBINATIONS) {
		if (Combination.every(CellIndex =>
				BoardValue[CellIndex] === player)
		) return true;
	}
	return false;
}

function checkDraw() {
	return [...$$('.cell')].every(Cell => Cell.classList.length > 1);
}

function showOverlay(winner) {
	const Overlay = $('#overlay');
	Overlay.classList.add('visible');
	Overlay.innerHTML = `
		<h1>
			Round ${round++}</br>
			${winner ? `${winner} won!` : 'Draw!'}
		</h1>
		<h2>Click to continue</h2>
	`;

	Overlay.addEventListener('click', (event) => {
		event.target.classList.remove('visible');
		event.target.innerHTML = '';
		resetCells();
		render();
	}, { once: true });
}

function handleUpdate() {
	const Player = PLAYERS[turn];
	const IsWinCondition = checkPlayerWin(Player.symbol);
	if (IsWinCondition) {
		Player.score++;
		showOverlay(Player.name);
	} else {
		const IsDraw = checkDraw();
		if (IsDraw) showOverlay(null);
	}
	turn = ++turn % 2;
}

function onMouseEnterCell(event) {
	event.target.textContent = PLAYERS[turn].symbol;
}

function onMouseLeaveCell(event) {
	event.target.textContent = '';
}

function onContextMenu(event) {
	event.preventDefault();
	return false;
}

function onCellClick(event) {
	const cell = event.target;
	cell.classList.add(`player-${PLAYERS[turn].symbol}`)
	cell.removeEventListener('mouseenter', onMouseEnterCell);
	cell.removeEventListener('mouseleave', onMouseLeaveCell);
	handleUpdate();
}

function attachCellEventHandlers(cell) {
	cell.addEventListener('contextmenu', onContextMenu);
	cell.addEventListener('mouseenter', onMouseEnterCell);
	cell.addEventListener('mouseleave', onMouseLeaveCell);
	cell.addEventListener('click', onCellClick, { once: true });
}

function clearSelection() {
	const selection = window.getSelection();
	if (!selection) return;
	if (selection.removeAllRanges) selection.removeAllRanges();
	else if (selection.empty) selection.empty();
}

function attachNameChangeHandler(input, index) {
	input.readOnly = true;
	input.addEventListener('blur', () => { input.readOnly = true; clearSelection();	});
	input.addEventListener('click', () => input.readOnly = false);
	input.addEventListener('change', () => PLAYERS[index].name = input.value);
}

function render() {
	$('#round-counter').textContent = round.toString();
	const ScoreContainer = $('#score-container');
	for (let Player of PLAYERS) {
		$(`.player-${Player.symbol} > .name`, ScoreContainer).value = Player.name;
		$(`.player-${Player.symbol} > .score`, ScoreContainer).textContent = Player.score;
	}
}

/* Main */

document.addEventListener('contextmenu', onContextMenu);
document.addEventListener('DOMContentLoaded', () => 	{
	$('#app').innerHTML = `
		<div id="game">
			<div id="header">
				<h1>Tic Tac Toe</h1>
				<div id="scoreboard">
					<h2>Round <span id="round-counter"></span></h2>
					<div id="score-container">
						<h3 class="player-x">
							<input type="text" maxlength="8" class="name"/></br>
							<span class="score"></span>
						</h3>
						<span id="reset-button"></span>
						<h3 class="player-o">
							<input type="text" maxlength="8" class="name"/></br>
							<span class="score"></span>
						</h3>
					</div>				
				</div>
			</div>
			<div id="board">
				${createCells(ROWS, COLUMNS).join('')}
			</div>
		</div>
		<div id="overlay"></div>
	`;
	render();

	$$('.name').forEach(attachNameChangeHandler);
	$$('.cell').forEach(attachCellEventHandlers);
	$('#reset-button').addEventListener('click', resetGame);
});
