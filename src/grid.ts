// "B" - Undamaged Part of Ship,
// "X" - Sunken Part of Ship,
// "." - Clear Water,
// "-" - Torpedo Miss
type SquareContent = "B" | "X" | "." | "-"

export interface IGrid {
	/**
	 * @returns a new Grid, populated with ships
	 */
	constructor(): IGrid
	/**
	 * @returns the "hidden" contents of a given square, 
	 * @throws error if the square is out of bounds
	 */
	getHiddenSquareContent(row: number, column: number): SquareContent
	/**
	 * @returns the "shown" contents of a given square, 
	 * @throws error if the square is out of bounds
	 */
	getShownSquareContent(row: number, column: number): SquareContent
}

export class Grid implements IGrid {

	Grid() {

	}

}
