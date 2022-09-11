import { IShip, IShipPart } from './types'

export class Ship implements IShip {
	private _parts: IShipPart[] = []
	get parts(): IShipPart[] {
		return this._parts
	}

	constructor(parts: IShipPart[]) {
		this._parts = parts.map(part => {
			part.ship = this
			return part
		})
	}

	isFloating(): boolean {
		return this._parts.reduce(
			(acc, part) => !part.isHit() || acc,
			false)
	}
}
