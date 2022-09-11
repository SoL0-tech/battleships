export type SquareContent = '-' | '.' | 'S' | 'X' | ' '

export interface ISquare {
	/**
	 * Performs the hit action on the object
	 */
	hit(): void
	/**
	 * @returns true if the square has been hit,
	 *   				false otherwise
	 */
	isHit(): boolean
	/**
	 * @returns the character to represent the square on the grid
	 * 					if 'Show', show it as it is
	 * 					if 'Hide', show the hidden representation
	 */
	getSquareContent(showOrHide: 'Show' | 'Hide'): SquareContent
}

export interface IWater extends ISquare {
	/**
	 * @returns true
	 */
	isWater(): boolean
}

export interface IShipPart extends ISquare {
	set ship(ship: IShip | undefined)
	get ship(): IShip | undefined
	get xPos(): number
	get yPos(): number
}

/**
 * @returns true if given object exposes an isWater() method that returns true
 */
export function isWater(o: any): boolean {
	return !!(o?.isWater?.())
}

export enum FireResult {
	Hit,
	Miss,
	Waste,
	Sunk,
	Win,
}

export interface IGrid {
	/**
	 * Adds a ship to the grid.
	 * @throws error if there is another ship in the way,
	 * 				 or if the ship goes out of bounds
	 */
	addShip(ship: IShip): void

	/**
	 * @returns true if there are any floating ships in the grid
	 * 					false otherwise
	 */
	containsFloatingShips(): boolean
	/**
	 * Fire a torpedo at a given square
	 * @returns the result of the torpedo shot
	 * @throws error if the square is out of bounds
	 */
	fireAtSquare(row: number, col: number): FireResult
	/**
	 * @returns the contents to be shown for a given square
	 */
	getSquareContent(row: number, col: number, showOrHide: 'Show' | 'Hide'): SquareContent
}

export enum ShipType {
	Battleship,
	Destroyer,
}

export interface IShip {
	get parts(): IShipPart[]
	/**
	 * @returns true if all the parts are hit
	 * 					false otherwise
	 */
	isFloating(): boolean
}
