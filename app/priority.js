exports.randomDirection = (directions) => {
    // directions looks like this: ['l','r','u','d']
    return directions[Math.floor(Math.random()*directions.length)]
}

//this sets a snake priority and determines what the snake should do
module.exports.buildPriority = (request, board) =>{

    //the list of strategies. Pushed into the list in order of priority
    var strat = []



    //the basis of survival. Don't crash.
    // const boardHeight = request.board.height
    // const boardWidth = request.board.width
    // const food = request.board.food //array of objects with x: and y: keys
    // const health = request.you.health
    const head = request.you.body[0]
    const directions = ['left','right','up','down']
    strat.push(dontCrash(directions, board, head))
    //don't eath the tail of a snake with head beside food


    // console.log(strat)
    //self-actualization - Can I kill right now?
    //esteem - Status needs. be the big snake and eat as much as possible
    //love/belonging - come in for a kiss on other shorter snakes if possible. Get your head near theirs.
    //safety - Avoid threat spaces
    //physiological - Get food and stay alive
    //assess food need
    //assess food convenience
    //assess other snake food need. Can I get a hungrier snake's food first?
    //can I trap another snake in a small space?
    //
    // this should return a list of strategy objects that we can filter/reduce later
    /*
        strategy:"foodHoarding", 
        target: {},
        moves: {}
        directions: [l,r,u,d],
        
        need: true/false, <-override all other strategies
    */
    return strat
}
atLocation= (board, poi) => {
    //what is the thing at this x and y?
    return board[poi.y][poi.x].content
}

getOrthoganalPoints= (board, poi) => {
    // make predictable list with invalid elements
    return [
        //direction is away from the supplied point
        {x:poi.x+1, y:poi.y, direction:'right'},
        {x:poi.x-1, y:poi.y, direction:'left'},
        {x:poi.x, y:poi.y+1, direction:'down'},
        {x:poi.x, y:poi.y-1, direction:'up'}
    ].filter(p=>{
        //remove all of the invalid elements
        if(p.x<0 || p.y<0 || p.y===board.length || p.x===board[0].length){
            return false
        } else return true
    })
}

//----------------------------
dontCrash = (directions, board, head) => {
    // the basics of this is "Do not leave the map."
    //this should be modified to "steer in directions with the most area"
    let choices = getOrthoganalPoints(board, head)
        .filter(poi=>{
            //if the poi returns B,b,h it is a no go zone
            let sp = atLocation(board, poi)
            if(sp.includes('b')||sp.includes('h')||sp.includes('B')){ 
                return false 
            } else return true
        }).map(poi=>{
            //clean up to just return direction part
            return poi.direction
        })
    return {strategy:'dontCrash', directions:choices}
}