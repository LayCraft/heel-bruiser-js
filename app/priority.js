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
    //directions is the remaining available start directions
    strat.push(dontCrash(directions, board, head))//don't collide with snake bodies and heads
    //don't move into a tail space if the head is by food
    strat.push(dontRiskIt(directions, board, head)) //don't move into an unnecesary risk spot if an equal alternate is avail (Don't eat tail of other snake if head near food. choose a safe spot over a risky spot if possible )

    //basically make a priority system that gives first choice moves for tie breakers 
    //[{'right','left'},{'up'}]

    //when assessing the doAttack sort of thing, check for rewards in order. Each do strategy should be hand assigned a priority to determine which breaks ties.

    //if the furthest point in a direction is a enemy head and there is no threat and there are less food pellets in the space than the difference in your lengths then steer into the channel for the kill

    // avoid crashing and confined spaces
    // build a list of directions from best to worst risk
    // assign a value to each direction representing cumulative "do" score.
    // risk/reward needs an adjustment point


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
    console.log("Using the priority version of atLocation()")
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

inventoryArea= (board, poi) => {
    //convert into simpler object
    //this takes the point sample on the board and returns all traversable points and a count of threats, and food.
    let checked = []
    let unchecked =[{x:poi.x, y:poi.y}]
    
    let traversable = [] // the final collection of points that can be navigated
    //keep looping until all unchecked become checked
    while(unchecked.length>0){
        let p = unchecked.pop()
        //only check unchecked locations
        if(!checked.includes({x:p.x, y:p.x})){
        }
    }
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