import {
	IShip,
	IShipPart,
	SquareContent,
} from './types'

export class ShipPart implements IShipPart {
	private _hit = false

	private _xPos = 0
	get xPos(): number {
		return this._xPos
	}

	private _yPos = 0
	get yPos(): number {
		return this._yPos
	}

	public ship: IShip | undefined = undefined

	constructor(x: number, y: number) {
		this._xPos = x
		this._yPos = y
	}

	hit(): void {
		this._hit = true
	}

	isHit(): boolean {
		return this._hit
	}

	getSquareContent(showOrHide: 'Show' | 'Hide'): SquareContent {
		return showOrHide === 'Show'
			? 'X'
			: this.isHit()
				? 'X'
				: '.'
	}
}

