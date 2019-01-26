module.exports = class Board{
	constructor(blob){
		//the constructor is a function that builds a basic board from the data
		//Meta about board
		this.id = blob.you.id
		this.width = blob.board.width
		this.height = blob.board.height
		//make an empty 2d array to hold the POIs
		this.board = [...Array(this.height)].map(()=> [...Array(this.width)].fill(null))
		for(let y=0; y<this.height; y++){
			for(let x=0; x<this.width; x++){
				this.board[y][x] = {x:x, y:y}
			}
		}

		// console.log(blob)
		
		//write food onto the board
		blob.board.food.forEach(nibble=>{
			//all food should be marked on the board
			nibble.food = true
			this.setSpace(nibble)
		})
		
		//write food onto the board
		blob.board.snakes.forEach((snake)=> this._buildSnake(snake))

		// this.setSpace({x:2,y:2,bork:"bork"})
		console.log(this.board)
	}

	getSpace(poi) {
		//What is at the location?
		return this.board[poi.y][poi.y]
	}

	setSpace(poi){
		//collect the existing space
		let space = this.getSpace(poi)
		// every key in the sent item should be added to the space
		Object.keys(poi).forEach(key => {
			// write the keys into space
			space[key] = poi[key]
		})
		//put the space back into the board
		this.board[poi.y][poi.x] = space

	}

	getOrth(poi){
		//return an array of all poi orthoganaly around the supplied one
		return [
			//candidate locations
			{x: poi.x-1, y: poi.y},
			{x: poi.x+1, y: poi.y},
			{x: poi.x, y: poi.y-1},
			{x: poi.x, y: poi.y+1},
		].filter(poi=>{
			//remove all of the elements that are outside the board parameters
			if(poi.x<0 || poi.y<0 || poi.y===this.height || poi.x===this.width){
					return false
			} else return true
		})
	}
	print(){}
	_buildSnake(snake){
		//handle all logic for placing snakes here
		console.log(snake)
	}
}