module.exports = class Board{
	constructor(blob){
		//the constructor is a function that builds a basic board from the data
		this.id = blob.you.id
		this.width = blob.board.width
		this.height = blob.board.height
		//make an empty 2d array
		this.board = Array(blob.board.height).fill(Array(blob.board.width).fill({}))
		this.getOrth(blob.you.body[0])
	}
	getSpace(poi) {
		//What is at the location?
		return this.board[poi.y][poi.y]
	}
	setSpace(poi){
		//Set the location
		this.board[poi.y][poi.x] = poi
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
			//remove all of the invalid elements
			if(poi.x<0 || poi.y<0 || poi.y===this.height || poi.x===this.width){
					return false
			} else return true
		})
	}
	print(){}
}