/**
 * A simple game of battleships
 * written in Typescript
 *
 * by Jared Murphy (2022)
 */


const container = getGameContainer()
const [numRows, numCols] = [10, 10] 	// Grid size

let shotsTaken = 0
let squaresSunk = 0

initializeHtmlElements(container, numRows, numCols)

// "B" - Undamaged Part of Ship,
// "X" - Sunken Part of Ship,
// "." - Clear Water,
// "-" - Torpedo Miss
type SquareContent = "B" | "X" | "." | "-"

// Initialize the game matrix
let grid: Array<Array<SquareContent>> = Array.from({ length: numRows }, () =>
	Array.from({ length: numCols }, () => '.'))

populateGridWithShips(grid)

/**
 * @returns The HTML element reserved for our game
 */
function getGameContainer(): HTMLElement {
	const gameContainer = document.getElementById("gameContainer")
	if (!gameContainer) {
		throw new Error("Container element not found")
	}

	return gameContainer
}

/**
 * Initializes the HTML elements to represent the board state,
 * as well as the elements for taking user input.
 */
function initializeHtmlElements(container: HTMLElement, numRows: number, numCols: number): void {
	const SQUARE_SIZE = 50 // Size of each square, in pixels
	const [GRID_TOP_OFFSET, GRID_LEFT_OFFSET] = [120, 70]

	// LAST MOVE REPORT
	createDiv(
		"Your move...",
		GRID_TOP_OFFSET - 2*SQUARE_SIZE,
		GRID_LEFT_OFFSET,
		"",
		"lastMoveReport"
	)

	// SHOW BUTTON
	const showButton = document.createElement("button")
	showButton.id = "showButton"
	showButton.innerText = "Show"
	showButton.style.top = `${GRID_TOP_OFFSET - 2*SQUARE_SIZE}px`
	showButton.style.left = `${GRID_LEFT_OFFSET+400}px`
	showButton.style.width = "70px"
	showButton.onclick = () => showToggle()
	container.appendChild(showButton)


	// COLUMN LABELS
	for (let j = 1; j < numCols+1; ++j) {
			createDiv(
				"" + j,
				GRID_TOP_OFFSET - SQUARE_SIZE,
				GRID_LEFT_OFFSET + j*SQUARE_SIZE - SQUARE_SIZE,
				"square"
			)
	}

	// GRID
	for (let i = 0; i < numRows; ++i) {
		// row label
		createDiv(
			String.fromCharCode(65+i),
			GRID_TOP_OFFSET + i*SQUARE_SIZE,
			GRID_LEFT_OFFSET - SQUARE_SIZE,
			"square"
		)
		// row
		for (let j = 0; j < numCols; ++j) {
			createDiv(
				".",
				GRID_TOP_OFFSET + i*SQUARE_SIZE,
				GRID_LEFT_OFFSET + j*SQUARE_SIZE,
				"square",
				`${i}${j}`)
		}
	}

	// MOVE PROMPT
	const moveLabel = document.createElement("div")
	moveLabel.innerText = "Enter coordinates (row, col), e.g. A5:"
	moveLabel.id = "moveLabel"
	moveLabel.className = "moveLabel"
	moveLabel.style.top = `${GRID_TOP_OFFSET + 11*SQUARE_SIZE+3}px`
	moveLabel.style.left = `${GRID_LEFT_OFFSET}px`
	container.appendChild(moveLabel)

	const moveInput = document.createElement("input")
	moveInput.id = "moveInput"
	moveInput.style.top = `${GRID_TOP_OFFSET + 11*SQUARE_SIZE}px`
	moveInput.style.left = `${GRID_LEFT_OFFSET+320}px`
	moveInput.style.width="40px"
	moveInput.onkeyup = (e) => inputKeyUp(e)
	container.appendChild(moveInput)
	moveInput.focus()

	const moveButton = document.createElement("button")
	moveButton.id = "moveButton"
	moveButton.innerText = "Fire!"
	moveButton.style.top = `${GRID_TOP_OFFSET + 11*SQUARE_SIZE}px`
	moveButton.style.left = `${GRID_LEFT_OFFSET+400}px`
	moveButton.style.width = "70px"
	moveButton.onclick = () => fire()
	container.appendChild(moveButton)
	


	function createDiv(
		text: string, top: number, left: number, className: string, id: string | null = null
	): void {
		const e = document.createElement("div")

		if (id) {
			e.id = id
		}

		e.innerText = text
		e.className = className

		e.style.top = `${top}px`
		e.style.left = `${left}px`

		container.appendChild(e)
	}
}

function populateGridWithShips(grid: Array<Array<SquareContent>>): void {
	spawnRandomShip(4)
	spawnRandomShip(4)
	spawnRandomShip(5)

	function spawnRandomShip(len: number): void {
		// 0 or 1, Vertical or Horizontal
		const downOrRight = Math.round(Math.random())

		// Make sure ship doesn't overshoot boundaries
		let [i, j]: [number, number] = [-1,-1];
		if (downOrRight) {
			// Down - Vertical
			i = Math.floor(Math.random()*(10-len))
			j = Math.floor(Math.random()*10)
		} else {
			// Right - Horizontal
			i = Math.floor(Math.random()*10)
			j = Math.floor(Math.random()*(10-len))
		}

		// Make sure ship doesn't intersect any others
		for (let k = 0; k < len; ++k) {
			const sqContents = downOrRight
				? grid[i+k][j]
				: grid[i][j+k]
			if (sqContents !== '.') {
				// If there is a ship in the way, roll again
				return spawnRandomShip(len)
			}
		}

		// There is space. Put the ship onto the grid.
		for (let k = 0; k < len; ++k) {
			if (downOrRight) {
				grid[i+k][j] = 'B'
			} else {
				grid[i][j+k] = 'B'
			}
		}
	}
}

/**
 * Toggle debugging mode on/off
 */
function showToggle() {
	const showButton = (document.getElementById('showButton') as HTMLButtonElement)
	const whatToDo: 'Hide' | 'Show' = showButton.innerText as 'Hide' | 'Show'

	for (let i = 0; i < 10; ++i) {
		for (let j = 0; j < 10; ++j) {
			const element = (document.getElementById(`${i}${j}`) as HTMLDivElement);
			element.innerText = whatToDo === 'Show'
				? getVisibleSquareContents(i, j)
				: getHiddenSquareContents(i, j)
		}
	}

	showButton.innerText = whatToDo === 'Show'
		? "Hide"
		: "Show";

}

function getVisibleSquareContents(i: number, j: number): string {
	return (grid[i][j] === '.') ? ' ' : grid[i][j]
}
function getHiddenSquareContents(i: number, j: number): string {
	return grid[i][j] === 'B' ? '.' : grid[i][j]
}

function inputKeyUp(e: KeyboardEvent): void {
	const moveInput = (document.getElementById('moveInput') as HTMLInputElement)
	const moveButton = (document.getElementById("moveButton") as HTMLButtonElement)

	if (moveInput.value === '') {
		moveButton.disabled = true
	} else if (e.key === "Enter") {
		fire()
	} else {
		moveButton.disabled = false
	}
}

function fire() {
	const moveInput = (document.getElementById('moveInput') as HTMLInputElement);
	const moveInputValue = moveInput.value;

	// Set input to empty
	moveInput.value = '';
	// Set fire button to disabled
	(document.getElementById('moveButton') as HTMLButtonElement).disabled = true;

	// Convert input to square
	let square: [row: number, col: number];
	try {
		square = getSquare(moveInputValue);
	} catch (e) {
		setLastMoveReport("Invalid move. Try again.")

		return
	}

	// Move is valid - count it as a shot
	shotsTaken += 1

	const [row, col] = square
	const sqElement = document.getElementById(`${row}${col}`) as HTMLDivElement;

	switch (grid[row][col]) {
	case '.':
		grid[row][col] = '-'
		setLastMoveReport("Miss")
	break;
	case 'B':
		grid[row][col] = 'X'
		squaresSunk += 1
		setLastMoveReport("Hit!")
	break;
	default:
		setLastMoveReport("No change. Wasted shot..")
	}

	sqElement.innerText = getHiddenSquareContents(row, col)

	if (squaresSunk >= 13) {
		setLastMoveReport('Sunk');
		(document.getElementById('moveInput') as HTMLInputElement).style.display = 'none';
		(document.getElementById('moveButton') as HTMLButtonElement).style.display = 'none';
		(document.getElementById('moveLabel') as HTMLLabelElement).innerText =
			`Well done! You completed the game in ${shotsTaken} shots`
	}

	function getSquare(value: string): [row: number, col: number] {
		const firstCharCode = value.charCodeAt(0)
		const secondOnwards = value.substring(1)

		// code < A
		if (firstCharCode < 65) {
			throw new Error()
		}

		// J < code < a
		if (firstCharCode > 74 && firstCharCode < 97) {
			throw new Error()
		}

		// j < code
		if (firstCharCode > 106) {
			throw new Error()
		}

		// 0-9
		const row = firstCharCode <= 74
			? firstCharCode - 65
			: firstCharCode - 97

		const col = parseInt(secondOnwards)-1
		console.log(col)
		if (col != col || col < 0 || col > 9) {
			throw new Error()
		}

		return [row, col]
	}
}

function setLastMoveReport(msg: string): void {
	const e = (document.getElementById('lastMoveReport') as HTMLElement);
	e.innerText = msg;
}
