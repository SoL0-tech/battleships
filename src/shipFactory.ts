import {
	IGrid,
	IShip,
	IShipPart,
	ShipType,
} from './types'
import { Ship } from './ship'
import { ShipPart } from './shipPart'

export class ShipFactory {
	/**
	 * @returns a new ship floating in a random place on the given Grid
	 */
	static create(type: ShipType, grid: IGrid): IShip {
		const len = (type === ShipType.Battleship ? 5 : 4)
		let [i, j]: [number, number] = [-1,-1];

		// Make sure we don't build a ship that overshoots boundaries
		const downOrRight = Math.round(Math.random())
		if (downOrRight) {
			// Down - Vertical
			i = Math.floor(Math.random()*(10-len))
			j = Math.floor(Math.random()*10)
		} else {
			// Right - Horizontal
			i = Math.floor(Math.random()*10)
			j = Math.floor(Math.random()*(10-len))
		}

		// Build the ship
		let parts: IShipPart[] = []
		for (let k = 0; k < len; ++k) {
			parts = [
				...parts,
				downOrRight
					? new ShipPart(j, i+k)
					: new ShipPart(j+k, i)
			]
		}
		const ship = new Ship(parts)

		// Try to add the ship to the grid
		try {
			grid.addShip(ship)
		} catch (e) {
			// there is overlap - roll again
			return ShipFactory.create(type, grid)
		}

		return ship
	}
}
