/**
 * A simple game of battleships
 * written in Typescript
 *
 * by Jared Murphy (Sept 2022)
 */

import { Grid } from './grid'
import { ShipFactory } from './shipFactory'
import {
	FireResult,
	IGrid,
	ShipType,
} from './types'

const [NUM_ROWS, NUM_COLS] = [10, 10]
let hideOrShow: 'Hide' | 'Show' = 'Hide'
let shotsTaken = 0

const grid = new Grid(NUM_ROWS, NUM_COLS)

populateGridWithShips([
	ShipType.Battleship,
	ShipType.Destroyer,
	ShipType.Destroyer,
], grid)

initializeHtmlElements(NUM_ROWS, NUM_COLS)

/**
 * Spawns ships of given types onto the grid
 */
function populateGridWithShips(shipTypes: ShipType[], grid: IGrid): void {
	for (let shipType of shipTypes) {
		spawnRandomShip(shipType)
	}

	function spawnRandomShip(shipType: ShipType): void {
		ShipFactory.create(shipType, grid)
	}
}

/**
 * Initializes the HTML elements to represent the board state,
 * as well as the elements for taking user input.
 */
function initializeHtmlElements(numRows: number, numCols: number): void {
	const SQUARE_SIZE = 50 // Size of each square, in pixels
	const [GRID_TOP_OFFSET, GRID_LEFT_OFFSET] = [120, 70]

	const container = document.getElementById('gameContainer')
	if (!container) {
		throw new Error('Game container element not found')
	}

	// LAST MOVE REPORT
	createDiv(
		"Welcome to Battleship. Your move..",
		GRID_TOP_OFFSET - 2*SQUARE_SIZE,
		GRID_LEFT_OFFSET,
		"",
		"lastMoveReport"
	)

	// SHOW BUTTON
	const showButton = document.createElement("button")
	showButton.id = "showButton"
	showButton.style.top = `${GRID_TOP_OFFSET - 2*SQUARE_SIZE}px`
	showButton.style.left = `${GRID_LEFT_OFFSET+400}px`
	showButton.style.width = "70px"
	showButton.onclick = () => toggleHideOrShow()
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
				"",
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

	// MOVE INPUT
	const moveInput = document.createElement("input")
	moveInput.id = "moveInput"
	moveInput.style.top = `${GRID_TOP_OFFSET + 11*SQUARE_SIZE}px`
	moveInput.style.left = `${GRID_LEFT_OFFSET+320}px`
	moveInput.style.width="40px"
	moveInput.onkeyup = (e) => inputKeyUp(e)
	container.appendChild(moveInput)

	// MOVE BUTTON
	const moveButton = document.createElement("button")
	moveButton.id = "moveButton"
	moveButton.innerText = "Fire!"
	moveButton.style.top = `${GRID_TOP_OFFSET + 11*SQUARE_SIZE}px`
	moveButton.style.left = `${GRID_LEFT_OFFSET+400}px`
	moveButton.style.width = "70px"
	moveButton.onclick = () => fire()
	container.appendChild(moveButton)
	
	resetInput()
	refreshBattlefieldContents()

	/**
	 * Creates a div from given parameters and appends it onto the container
	 */
	function createDiv(
		text: string, top: number, left: number, className: string, id: string | null = null
	): void {
		const e = document.createElement("div")

		if (id) {
			e.id = id
		}

		e.innerText = text
		e.className = className

		e.style.top = `${top}px`;
		e.style.left = `${left}px`;

		(container as HTMLElement).appendChild(e)
	}

	/**
	 * Toggle debugging mode on/off
	 */
	function toggleHideOrShow() {
		hideOrShow = hideOrShow === 'Show' ? 'Hide' : 'Show'

		resetInput()
		refreshBattlefieldContents()
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
}

/**
 * Enacts 'Fire!'
 */
function fire(): void {
	const moveInputValue = (document.getElementById('moveInput') as HTMLInputElement).value;

	let square: [row: number, col: number];
	try {
		square = getSquareCoordsFromInput(moveInputValue);
	} catch (e) {
		setLastMoveReport("Invalid move. Try again.")
		resetInput()
		return
	}

	// Move is valid. Proceed
	shotsTaken += 1
	const result = grid.fireAtSquare(square[0], square[1])

	switch (result) {
		case FireResult.Hit:
			setLastMoveReport('Hit!')
		break
		case FireResult.Miss:
			setLastMoveReport('Miss')
		break
		case FireResult.Waste:
			setLastMoveReport('Wasted shot')
		break
		case FireResult.Sunk:
			setLastMoveReport('Sunk')
		break
		case FireResult.Win:
			setLastMoveReport('Sunk');
			(document.getElementById('moveInput') as HTMLInputElement).style.display = 'none';
			(document.getElementById('moveButton') as HTMLButtonElement).style.display = 'none';
			(document.getElementById('moveLabel') as HTMLLabelElement).innerText =
				`Well done! You completed the game in ${shotsTaken} shots`
		break
		default:
			// none
	}

	resetInput()
	refreshBattlefieldContents()

	/**
	 * Converts the input to square coordinates
	 * @throws error if the input is invalid
	 */
	function getSquareCoordsFromInput(input: string): [row: number, col: number] {
		const firstCharCode = input.charCodeAt(0)
		const secondOnwards = input.substring(1)

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

		const col = parseInt(secondOnwards) - 1

		if (col != col || col < 0 || col > 9) {
			throw new Error()
		}

		return [row, col]
	}
}

/**
 * Clears the input box, focuses it and disables the fire button
 */
function resetInput(): void {
	const moveInput = (document.getElementById('moveInput') as HTMLInputElement)
	// set input to empty
	moveInput.value = '';
	// set button to disabled
	(document.getElementById('moveButton') as HTMLButtonElement).disabled = true;
	// focus input
	moveInput.focus()
}

/**
 * Repaints the contents of the grid and the show/hide button on the page
 */
function refreshBattlefieldContents(): void {
	const showButton = (document.getElementById('showButton') as HTMLButtonElement)
	showButton.innerText = hideOrShow === 'Show' ? "Hide" : "Show";

	for (let i = 0; i < 10; ++i) {
		for (let j = 0; j < 10; ++j) {
			(document.getElementById(`${i}${j}`) as HTMLDivElement)
				.innerText = grid.getSquareContent(i, j, hideOrShow);
		}
	}
}

/**
 * Sets the message at the top of the screen reporting on the last move
 */
function setLastMoveReport(msg: string): void {
	const e = (document.getElementById('lastMoveReport') as HTMLElement);
	e.innerText = msg;
}
