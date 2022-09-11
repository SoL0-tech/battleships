import {
	FireResult,
	IGrid,
	IShip,
	IShipPart,
	ISquare,
	isWater,
	SquareContent,
} from './types'
import { Water } from './water'

export class Grid implements IGrid {
	private ships: IShip[] = []
	private squares: Array<Array<ISquare>> = []

	constructor(numRows: number, numCols: number) {
		// Initialize the game matrix with clear water
		this.squares = Array.from({ length: numRows }, () =>
			Array.from({ length: numCols }, () => new Water()))
	}

	addShip(ship: IShip) {
		// Check if there is an overlapping ship
		for (let part of ship.parts) {
			if (!isWater(this.squares[part.yPos][part.xPos])) {
				throw new Error(`Square (${part.yPos},${part.xPos}) already occupied`)
			}
		}

		// There is no overlap. Proceed
		for (let part of ship.parts) {
			this.squares[part.yPos][part.xPos] = part
		}
		this.ships = [...this.ships, ship]
	}

	containsFloatingShips(): boolean {
		return this.ships.reduce(
			(acc, ship) => ship.isFloating() || acc,
			false)
	}
	
	fireAtSquare(row: number, col: number): FireResult {
		const square = this.squares[row][col]

		if (square.isHit()) {
			return FireResult.Waste
		}

		square.hit()

		if (isWater(square)) {
			return FireResult.Miss
		}

		if ((square as IShipPart).ship?.isFloating()){
			return FireResult.Hit
		}

		if (this.containsFloatingShips()) {
			return FireResult.Sunk
		}

		return FireResult.Win
	}

	getSquareContent(row: number, col: number, hideOrShow: 'Hide' | 'Show'): SquareContent {
		return this.squares[row][col].getSquareContent(hideOrShow)
	}
}
