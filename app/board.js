module.exports = class Board{
	constructor(blob){
		//the constructor is a function that builds a basic board from the data
		//Meta about board
		this.id = blob.you.id
		this.width = blob.board.width
		this.height = blob.board.height
		//make an empty 2d array to hold the POIs
		this.board = [...Array(this.height)].map(()=> [...Array(this.width)].fill(null))
		// console.log(blob)
		
		//write food onto the board
		blob.board.food.forEach(bite=>{
			//all food should be marked on the board
			bite.food = true
			this.setSpace(bite)
		})
		

		// this.setSpace({x:2,y:2,bork:"bork"})
		console.log(this.board)
	}

	getSpace(poi) {
		//What is at the location?
		return this.board[poi.y][poi.y]
	}

	setSpace(poi){
		//Set the location
		//when a location is null set it to whatever is sent
		if(!this.board[poi.y][poi.x]){
			this.board[poi.y][poi.x] = poi
		} else {
			console.log("Null not found")
			//collect the existing space
			let space = this.getSpace(poi)
			// every key in the sent item should be added to the space
			poi.keys.forEach(key => {
				//write the keys into space
				space[key] = poi[key]
			})
			//put the space back into the board
			this.setSpace(space)
		}
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
}