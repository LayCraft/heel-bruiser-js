module.exports = class Board{
	/**
	 * Snakes are structured as objects. Each space of a snake has a link to the head.
	 * The head contains a link to the tail. 
	 * The head references the tail object that references the tail object that references the head object…
	 * BE CAREFUL ABOUT ITERATION
	 */
	constructor(blob){
		//the constructor is a function that builds a basic board from the data
		//Meta about board
		this.myId = blob.you.id
		this.width = blob.board.width
		this.height = blob.board.height
		//make an empty 2d array to hold the POIs
		this.board = [...Array(this.height)].map(()=> [...Array(this.width)].fill(null))
		for(let y=0; y<this.height; y++){
			for(let x=0; x<this.width; x++){
				this.board[y][x] = {x:x, y:y, traversable:true}
			}
		}

		//write food onto the board
		blob.board.food.forEach(nibble=>{
			//all food should be marked on the board
			nibble.food = true
			this.setSpace(nibble)
		})
		
		//write food onto the board
		blob.board.snakes.forEach((snake)=> this._buildSnake(snake))
		// console.log(this.board)
		//TODO write the snake drawer
		this.print()
		// console.log(this.board)
	}

	getSpace(poi) {
		//What is at the location?
		return this.board[poi.y][poi.x]
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
	_buildSnake(snake){
		//handle all logic for placing snakes here
		// console.log(snake)
		snake.body.forEach((poi, i)=>{
			if (i===0){
				//is a head
				//snake head holds meta info
				poi['head']=true
				poi['health']=snake.health
				poi['size']=snake.body.length
				poi['tailspace']=snake.body[snake.body.length-1]
				poi['id']=snake.id
			}else if(i==snake.body.length-1){
				// is a tail
				poi['tail']=true
				//all non body spaces know the head
				poi['headspace']=snake.body[0]
			} else {
				//is a body
				poi['body']=true
				//all non body spaces know the head
				poi['headspace']=snake.body[0]
			}
			//set the space on the board
			this.setSpace(poi)
		})
	}

	print(){
    this.board.forEach((y)=>{
			let yrow = '|'
			y.forEach((x)=>{
					// console.log(x)
					//six spaces should be enough to represent each contents ina  human readable way.
					let f = ' ' //filler character should change if traversable
					let xinfo = ''
					//write the spaces
					if (x.head) xinfo = xinfo + '✅'
					if (x.food) xinfo = xinfo + '🐿️'
					if (x.tail) xinfo = xinfo + '❇️'
					if (x.body) xinfo = xinfo + '❎'
					if (x.threat) xinfo = xinfo + '🔥'
					if (!x.traversable) f = '🧱'

					yrow = yrow + xinfo.padStart(6,f) + '|'
			})
			console.log(yrow)
			let line = ''


			while(line.length<yrow.length){
					line = line + '-'
			}
			//print the depiction of the line
			console.log(line)
	})
	}
}