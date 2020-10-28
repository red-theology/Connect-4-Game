/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

const board = []; // array of rows, each row is array of cells  (board[y][x])
let player = 1;
const gameBoard = document.getElementById('game');
const makeTable = document.createElement('table');
makeTable.setAttribute('id', 'board');
gameBoard.append(makeTable);
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[h][w])
 */

function makeBoard() {
	for (let h = 0; h < HEIGHT; h++) {
		//outer loop will allow us to build 7 rows (WIDTH) for every iteration through the column (HEIGHT)
		let rowArray = []; //initialize an interal array
		for (let w = 0; w < WIDTH; w++) {
			rowArray[w] = 0; //increment the array each time through the loop
		}
		board.push(rowArray); //finish by pushing the newly made array into the board array
	}
}
const makeHtmlBoard = () => {
	// TODO: add comment for this code
	const numRows = board.length;
	const numColumns = board[0].length;
	const groupOfCols = document.createElement('colgroup');
	makeTable.append(groupOfCols);
	// create header cells to click on to drop checker
	for (let c = 0; c < numColumns; c++) {
		const headCol = document.createElement('col');
		headCol.setAttribute('data-col', c);
		groupOfCols.append(headCol);
	}
	for (let x = 0; x < numColumns; x++) {
		const headCell = document.createElement('th');
		headCell.className = 'header';
		headCell.setAttribute('data-top', x);
		headCell.innerText = 'V';
		makeTable.append(headCell);
	}
	for (let tr = numRows; tr > 0; tr--) {
		let makeTR = document.createElement('tr');
		makeTR.setAttribute('data-row', tr);
		makeTable.append(makeTR);
		for (let td = 0; td < numColumns; td++) {
			let makeTD = document.createElement('td');
			makeTD.setAttribute('id', `${tr}_${td}`);
			makeTR.append(makeTD);
		}
	}
};

makeTable.addEventListener('click', (ev) => {
	if (ev.target.className.includes('header')) {
		const dataCol = ev.target.getAttribute('data-top');
		const col = parseInt(dataCol, 10);
		let row = board.length - 1;
		while (row >= 0 && board[row][col]) {
			row--;
		}
		if (row >= 0) {
			// valid move
			board[row][col] = player; // update app state
			// update DOM
			const cellIndex = row * WIDTH + col;
			gameBoard.querySelectorAll('td')[cellIndex].style.backgroundColor = player === 1 ? 'yellow' : 'red';
			console.log(`Player # ${player} Row: # ${row}`);
			if (checkForWin()) {
				endGame(`Player ${player} wins!`);
			}
			player = player === 1 ? 2 : 1;
			// if(player === 1) {
			//   player = 2;
			// } else {
			//   player = 1;
			// }
		}
	}
});
const endGame = (msg) => {
	const newWinner = document.getElementById('winner');
	newWinner.textContent = msg;
	const resetButton = document.createElement('button');
	resetButton.textContent = 'NEW GAME';
	newWinner.append(resetButton);

	resetButton.addEventListener('click', function(ev) {
		window.location.reload();
	});
};

const checkForWin = () => {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		// please help explain
		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === player);
	}

	// TODO: read and understand this code. Add comments to help you. I have little clue how this works

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			var horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			var vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			var diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			var diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
};

makeBoard();
makeHtmlBoard();
