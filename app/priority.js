const diagnostic = require('./board_diagnostic')

//this sets a snake priority and determines what the snake should do
exports.buildPriority = (request, board) =>{
    let priorityList = diagnostic.getOrthoganalPoints(board, request.body.you.body[0])
        .filter(poi=>{
            //read content from location
            let content = diagnostic.atLocation(board, poi)
            //if it contains a B or b it becomes impassable so filter will remove them
            if(content.includes('B')||content.includes('b')){
                return false
            } else return true
        }).map(poi=>{
            // console.log(poi)
            //each POI should have an inverntory added
            return diagnostic.inventoryArea(board, poi)
        })
    // console.log(spaz)

    //the list of strategies. Pushed into the list in order of priority
    
    // var strat = []

    //the basis of survival. Don't crash.
    // const boardHeight = request.board.height
    // const boardWidth = request.board.width
    // const food = request.board.food //array of objects with x: and y: keys
    // const health = request.you.health
    // const head = request.you.body[0]
    //directions is the remaining available start directions
    // strat.push(dontCrash(directions, board, head))//don't collide with snake bodies and heads
    //don't move into a tail space if the head is by food
    // strat.push(dontRiskIt(directions, board, head)) //don't move into an unnecesary risk spot if an equal alternate is avail (Don't eat tail of other snake if head near food. choose a safe spot over a risky spot if possible )

    //basically make a priority system that gives first choice moves for tie breakers 
    //[{'right','left'},{'up'}]

    //when assessing the doAttack sort of thing, check for rewards in order. Each do strategy should be hand assigned a priority to determine which breaks ties.

    //if the furthest point in a direction is a enemy head and there is no threat and there are less food pellets in the space than the difference in your lengths then steer into the channel for the kill

    // avoid crashing and confined spaces
    // build a list of directions from best to worst risk
    // assign a value to each direction representing cumulative "do" score.
    // risk/reward needs an adjustment point

    const directions = ['left','right','up','down']

    return diagnostic.randomDirection(directions)
}