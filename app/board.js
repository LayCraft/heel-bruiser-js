"use strict"
// const LocationCache = require('./location_cache')

module.exports = class Board{
	/**
	 * Snakes are structured as objects. Each space of a snake has a link to the head.
	 * The head contains a link to the tail. 
	 * The head references the tail object that references the tail object that references the head object…
	 * BE CAREFUL ABOUT ITERATION
	 */
	constructor(blob){
		//the constructor is a function that builds a basic board from the data
		// this.cache = new LocationCache() //this is a data structure for quickly storing and grabbing spaces
		//Meta about board
		this.myId = blob.you.id
		this.myHead = blob.you.body[0]
		this.myLength = blob.you.body.length
		this.myHealth = blob.you.health
		this.food = blob.board.food
		this.width = blob.board.width
		this.height = blob.board.height
		this.snakes = blob.board.snakes //hold onto the list of snakes
		//make an empty 2d array to hold the POIs
		this.board = [...Array(this.height)].map(()=> [...Array(this.width)].fill(null))
		for(let y=0; y<this.height; y++){
			for(let x=0; x<this.width; x++){
				this.board[y][x] = {x:x, y:y, traversable:true, danger:false}
			}
		}

		//write food onto the board
		blob.board.food.forEach(nibble=>{
			//all food should be marked on the board
			nibble.food = true
			//we like food
			nibble['incentive'] = true
			this.setSpace(nibble)
		})
		
		//write snakes onto the board
		blob.board.snakes.forEach((snake)=> this._buildSnake(snake))

		//examine all areas surrounding the head
		//NOTE: will cause error 500 when there are no orthoganal moves (You are dead regardless of what you do.)
		this.directions = this.getOrth(this.myHead).map(p=>{
			//attach an area to the directions
			
			//diagnostic object for space
			let diagnosis= this.diagnoseArea(p)
			p["areaCount"] = diagnosis.area
			p["dangers"] = diagnosis.dangers
			p["incentives"] = diagnosis.incentives
			p["tails"] = diagnosis.tails
			p["direction"] = this.directionFromHead(p)
			
			//copy the useful properties in and return directions
			let actualSpace = this.getSpace(p)
			if(actualSpace.danger) p["danger"] = actualSpace.danger
			if(actualSpace.food) p["food"] = actualSpace.food
			if(actualSpace.head) p["head"] = actualSpace.head
			if(actualSpace.tail)p["tail"] = actualSpace.tail
			if(actualSpace.body)p["body"] = actualSpace.body
			if(actualSpace.traversable) p["traversable"] = actualSpace.traversable
			return p
		}).filter(p=>{
			if(p.areaCount>0){
				return true
			} else return false
		})
		//orthoganal spaces around non threatening heads are incentive spaces
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
			{x: poi.x, y: poi.y+1},
			{x: poi.x+1, y: poi.y},
			{x: poi.x, y: poi.y-1},
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
			if(i===0 && snake.id!=this.myId){
				// mark orthoganal points by head as threats
				orthPoi.forEach(p=>{
					if(snake.body.length>=this.myLength){
						//the snake is dangerous
						p['danger'] = true
						this.setSpace(p)
					} else {
						//the snake is little and you should get into its headspace to kill it.
						p['incentive'] = true
						this.setSpace(p)
					}
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
	directionFromHead(poi){
		if(poi.x<this.myHead.x){ 
			return 'left'
		} else if(poi.x>this.myHead.x){ 
			return 'right'
		} else if(poi.y<this.myHead.y){
			return 'up'
		} else if(poi.y>this.myHead.y){ 
			return 'down'
		}
	}
	diagnoseArea(poi){
		//starting at this point how many traversable spaces are there?
		//note: the input in this function assumes that the poi is not an actual board space.
		//comes in as {x:1, y:1} which aren't confirmed on the board
		//gathers { x: 1, y: 1, traversable: true } when examining points
		//loop
			//get orthoganal points from element in unchecked list
			//add unvisited traversable points to the unchecked list 
			//add all points that are not traversable to the checked list

		//assign initial so that this function works with fake coordinate objects if needed
		let unchecked = [{x:poi.x, y:poi.y}]
		let checked = []
		let area = 0
		let dangers = []
		let incentives = []
		let tails = 0

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
			let realPoint = this.getSpace(point)
			let danger = false
			if(realPoint.traversable) {
				//count space
				area++
				
				//count danger and incentives
				if(realPoint.danger) {
					//save all dangers
					dangers.push(point)
					danger = true
				}
				if(realPoint.incentive) {
					//save all incentive spaces
					incentives.push(point)
				}
				//remember that we found a tail (it may become a open space later)
				if(realPoint.tail) tails++

				// do not traverse past a dangerous space. Consider the area non-area unless you can get to it some other way.
				if(realPoint.danger){
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
			} 
			//record that it has been seen for traversability
			checked.push(point)
		}
		// Return object with counts of stuff
		return {dangers:dangers, incentives:incentives, area:area, tails:tails}
	}

	routeTo(startPoi, goalPoi){
		//clean the points
		const start = {x:startPoi.x , y:startPoi.y}
		const goal = {x:goalPoi.x, y:goalPoi.y}

		//be sure that start and goal are within board: sanity check
		if( start.x <0 || start.y <0 ||
			start.x===this.width || start.y===this.height || 
			goal.x <0 || goal.y <0 ||
			goal.x===this.width || goal.y===this.height){
			return null
		}		
		//h value is the heuristic value distance Manhattan
		const h = (poi1) => {
			return Math.abs(poi1.x-goal.x) + Math.abs(poi1.y-goal.y)
		}

		//g value is the cost of the route so far
		const g = (poi) => {
			//missing previous means start space
			if(!poi.previous){ 
				//start space is g value of 0
				return 0 
			} else {
				let g = poi.previous.g +1 
				//current space costs
				let realSpace = this.getSpace(poi)
				if(realSpace.danger){g=g+2} //danger counts as an additional double space to travel
				if(realSpace.incentive) g=g-1 //incentives act as reduced travel rate
				if(g<poi.previous.g) g=poi.previous.g //be sure that there are no values below zero.
				return g
			}
		}

		//f value is the sum of the heuristic plus the cost of the route so far 
		const f = (poi) => {
			return poi.g + poi.h
		}
		//are the two poi the same x and y values?
		const equalPoi = (poi1, poi2) => {
			if(poi1.x === poi2.x && poi1.y === poi2.y){
				return true
			} else return false
		}			
		//does the set include an equivalent x and y value?
		const setIncludes = (set, poi) => {
			for(let i=0; i<set.length; i++){
				if(equalPoi(poi, set[i])) return true
			}
			return false
		}

		//traverse the array of poi starting at the end and going back to start
		const buildFinalPath = (poi, accumulator=[]) => {
			//function takes poi and looks traverses all previous
			accumulator.push({x:poi.x, y:poi.y})
			if(!poi.previous) {
				// at first poi. Reverse the set and return it
				return accumulator.reverse()
			} else {
				//need to collect current poi and traverse all previous steps
				return buildFinalPath(poi.previous, accumulator)
			}
		}
		const hgf = (poi) => {
			poi["h"] = h(poi)
			poi["g"] = g(poi)
			poi["f"] = f(poi)
			return poi
		}
		const downsamplePoi = (poi) => String(poi.x)+":"+String(poi.y)

		// clean anything that the caller sent into mere x and y.
		let closedSet = [] //points that are already evaluated
		let openSet = [start] //unevaluated points

		while(openSet.length>0){
			//collect the coordinate and the actual space for analysis
			let currentPoi = hgf(openSet.pop())
			// currentPoi = hgf(currentPoi)

			if(equalPoi(currentPoi, goal)){
				// if currentPoi is destination we rebuild the path because we found the destination
				return buildFinalPath(currentPoi)
			} else if(!closedSet.includes(downsamplePoi(currentPoi))){
				//get neighbours and keep the current as the previous
				let neighbours = this.getOrth(currentPoi)
					.filter(p=>{
						//filter neighbours that are in the closed set
						return !closedSet.includes(downsamplePoi(currentPoi))
					}).map(p=>{
						//add a link to each neighbour that references where they were traversed from
						p["previous"] = currentPoi
						return p
					}).forEach(p=>{
						//each neighbour should get pushed into the open set
						openSet.push(p)
					})
				// keep openSet sorted by f so the pop is always the lowest number
				openSet =  openSet.sort((a,b)=>{
					if(a.f==NaN || b.f==NaN) console.log("Somewhere a NaN slipped into F.")
					if(a.f===b.f) return 0
					if(a.f<b.f) return 1
					if(a.f>b.f) return -1
				}) 
			}
		}
		return null
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
						if (x.incentive) f = '+'
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