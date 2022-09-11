import {
	IWater,
	SquareContent,
} from './types'

export class Water implements IWater {
	private _hit = false

	hit(): void {
		this._hit = true
	}

	isHit(): boolean {
		return this._hit
	}

	isWater(): boolean {
		return true
	}

	getSquareContent(showOrHide: 'Show' | 'Hide'): SquareContent {
		return showOrHide === 'Show'
		  ? ' '
		  : this.isHit()
				? '-'
				: '.'
	}
}
