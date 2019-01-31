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
		this.myHead = blob.you.body[0]
		this.myLength = blob.you.body.length
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

		// this.print()
		this.directions = this.getOrth(this.myHead).map(p=>{
			//attach an area to the directions
			console.log(this.getSpace(p))
			p["area"] = this.traversableArea(p)
			return p
		}).filter(p=>{
			if(p.area>0){
				return true
			} else return false
		}).sort((a,b)=>{
			if(a<b)return -1
			if(a>b)return 1
			if(a===b)return 0
		})
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
			{x: poi.x-1, y: poi.y, direction: 'left'},
			{x: poi.x, y: poi.y+1, direction: 'down'},
			{x: poi.x+1, y: poi.y, direction: 'right'},
			{x: poi.x, y: poi.y-1, direction: 'up'},
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
			//-----Board facts below
			if (i===0){
				//is a head
				//snake head holds meta info
				poi['head']=true
				poi['health']=snake.health
				poi['size']=snake.body.length
				poi['tailspace']=snake.body[snake.body.length-1]
				poi['id']=snake.id
				poi['traversable']=false
			}else if(i==snake.body.length-1){
				// is a tail
				poi['tail']=true
				//all non body spaces know the head
				poi['headspace']=snake.body[0]
				//do not know if traversable
			} else {
				//is a body
				poi['body']=true
				//all non body spaces know the head
				poi['headspace']=snake.body[0]
				poi['traversable']=false
			}
			//set the space on the board with the facts
			this.setSpace(poi)

			//-----Danger identification below-----------
			// "Opinions" on what is dangerous
			let orthPoi = this.getOrth(poi).map(p=>this.getSpace(p))
			//is a head, is not me, is an equal or longer snake,
			if(i===0 && snake.id!=this.myId && snake.body.length>=this.myLength){
				// mark orthoganal points by head as threats
				orthPoi.forEach(p=>{
					p['danger'] = true
					this.setSpace(p)
				})
			}
			//is a head, is not me, has at least one food near the head
			if(i===0 && orthPoi.filter(p=>{ return p.food })){
				//mark tail a threat of expansion if head is beside food. (do not traverse)
				poi.tailspace['danger']=true
				this.setSpace(poi)
			}
		})
	}
	
	traversableArea(poi){
		//starting at this point how many traversable spaces are there?
		//note: the input in this function assumes that the poi is not an actual board space.
		//comes in as {x:1, y:1} which aren't confirmed on the board
		//gathers { x: 1, y: 1, traversable: true } when examining points
		//loop
			//get orthoganal points from element in unchecked list
			//add unvisited traversable points to the unchecked list 
			//add all points that are not traversable to the checked list

		//assign initial so that this function works with fake coordinate objects if needed
		let unchecked = [Object.assign(poi)]
		let checked = []
		let area = 0

		const listHasPoi = function(list, poi){
			//look through the checked list for an equal x and y value
			for(let i=0; i<list.length; i++){
				if(list[i].x===poi.x && list[i].y===poi.y){
					return true
				}
			}
			return false
		}

		while(unchecked.length>0){
			//save space for analysis
			let point = unchecked.pop()
			if(this.getSpace(point).traversable) {
				//count space
				area++
				//add all connected points that aren't in lists
				this.getOrth(point).filter(p=>{
					//if point in unchecked return false
					if(listHasPoi(unchecked, p)) return false
					//if point in checked return false
					if(listHasPoi(checked, p)) return false
					//if all has been checked…
					return true
				}).forEach(p=> unchecked.push(p))
			} 
			//record that it has been seen for traversability
			checked.push(point)
		}
		return area
	}
	routesTo(poi){
		//get the route to a particular board location
	}
	print(){
    this.board.forEach((y)=>{
			let yrow = '|'
			y.forEach((x)=>{
					//six spaces should be enough to represent each contents ina  human readable way.
					let f = ' ' //filler character should change if traversable
					let xinfo = ''
					//write the spaces
					if (x.food) xinfo = xinfo + 'F'
					if (x.head) xinfo = xinfo + 'H'
					if (x.body) xinfo = xinfo + 'B'
					if (x.tail) xinfo = xinfo + 'T'
					if (x.danger) xinfo = xinfo + '!'
					if (!x.traversable) f = '…'

					yrow = yrow + xinfo.padEnd(6,f) + '|'
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