/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

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
	const numRows = board.length;
	// store length/number of array in a variable. This gives us the number of rows we will work with
	const numColumns = board[0].length;
	// this will give us the number of columns we will work with. Could be any index number. We just need 7 columns.
	// const groupOfCols = document.createElement('colgroup');
	// // create group elements for the top of the game
	// makeTable.append(groupOfCols);
	// // create header cells to click on to drop checker
	// for (let c = 0; c < numColumns; c++) {
	// 	// loop through 7 columns, create column elements, give each unique data-attribute, append to the DOM
	// 	const headCol = document.createElement('col');
	// 	headCol.setAttribute('data-col', c);
	// 	groupOfCols.append(headCol);
	// }
	for (let x = 0; x < numColumns; x++) {
		// make TH elements to click on to drop checker into the board. Dynamically set attribute to be able to later correspond with tds.
		const headCell = document.createElement('th');
		headCell.className = 'header';
		headCell.setAttribute('data-top', x);
		headCell.innerText = 'V';
		makeTable.append(headCell);
	}
	for (let tr = numRows; tr > 0; tr--) {
		// create the elements to the table. Create 7 tds for every tr. This will give us our game board.
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
// Create event listener to activate once the TH elements are clicked. Will run a loop to check to see if the value of the row is >= 0.
//Row number decrements every time through the loop if the bottom cell has been filled until it reaches -1, at which point the loop terminates.
//

function handleHeaderClick(ev) {
	if (ev.target.className.includes('header')) {
		const dataCol = ev.target.getAttribute('data-top');
		const col = parseInt(dataCol, 10);
		// change value from string to a number
		rowCheck(col);
	}
}

function clickBoard() {
	makeTable.addEventListener('click', handleHeaderClick);
}

const rowCheck = (c) => {
	let row = board.length - 1;
	while (row >= 0 && board[row][c]) {
		row--;
	}
	if (row >= 0) {
		// valid move
		board[row][c] = player; // update app state
		// update DOM
		const cellIndex = row * WIDTH + c;
		// This allows us to fill the unique cell with the proper color
		gameBoard.querySelectorAll('td')[cellIndex].style.backgroundColor = player === 1 ? 'yellow' : 'red';
		// This fills the td with the appropriate color. If it is player 1, it will use yellow; if player 2, it will use red
		// The conditional below will check to see if a player has won and the game is over. I still need to remove the event listner if the game is over.
		gameOver();
	}
};
const changePlayer = () => {
	player = player === 1 ? 2 : 1;
	// if(player === 1) {
	//   player = 2;
	// } else {
	//   player = 1;
	// }
};

const gameOver = () => {
	if (checkForWin()) {
		endGame(`Player ${player} wins!`);
		makeTable.removeEventListener('click', handleHeaderClick);
	}
	// checkForTie();
	changePlayer();
};

const endGame = (msg) => {
	const newWinner = document.getElementById('winner');
	newWinner.textContent = msg;
	const resetButton = document.createElement('button');
	resetButton.textContent = 'NEW GAME';
	newWinner.appendChild(resetButton);

	resetButton.addEventListener('click', function(ev) {
		window.location.reload();
	});
};

const checkForWin = () => {
	function win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match player
		// .every() method returns a win because it searches to see if the coordinates from the loop (that the function is run thru) fits the specs for getting 4 in a row.
		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === player);
	}

	// Loop checks each individual coordinate to see if it matches either horizontally, vertically, diagonally to the right, or diagonally to the left.
	// Checks four coordinates for consecutive matches
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];
			if (win(horiz) || win(vert) || win(diagDR) || win(diagDL)) {
				return true;
			}
		}
	}
};

makeBoard();
makeHtmlBoard();
clickBoard();

// const checkForTie = () => {
// 	for (let i = 0; i < board.length; i++) {
// 		for (let n = 0; n < board.length + 1; n++) {
// 			if (board[n][i].includes(0) !== true) {
// 				alert('The game is a tie! Time for a new round!');
// 				window.location.reload();
// 			}
// 		}
// 	}
// };
