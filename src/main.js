import './style.css';

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

/* Functions */

function createCells(rows, cols) {
	return new Array(rows * cols).fill(null)
			.map(() => `<span class="cell"></span>`);
}

/* Main */

document.addEventListener('DOMContentLoaded', () => 	{
	document.querySelector('#app').innerHTML = `
		<div id="game">
			<div id="header">
				<h1>Tic Tac Toe</h1>
				<div id="scoreboard">
					<h2>Round <span id="round-counter">1</span></h2>
					<div id="score-container">
						<h3 id="p1-score" class="player-x">
							<span class="name">${PLAYERS[0].name}</span></br>
							<span class="score">${PLAYERS[0].score}</span>
						</h3>
						<span id="reset-button"></span>
						<h3 id="p2-score" class="player-o">
							<span class="name">${PLAYERS[1].name}</span></br>
							<span class="score">${PLAYERS[1].score}</span>
						</h3>
					</div>				
				</div>
			</div>
			<div id="board">
				${createCells(ROWS, COLUMNS).join('')}
			</div>
		</div>
		<div id="overlay"></div>
	`.replace(/[\t\n]/g, '');
});