//this sets a snake priority and determines what the snake should do
module.exports.buildPriority = (request, board) =>{

    //the list of strategies. Pushed into the list in order of priority
    var strat = []



    //the basis of survival. Don't crash.
    // const boardHeight = request.board.height
    // const boardWidth = request.board.width
    // const food = request.board.food //array of objects with x: and y: keys
    // const health = request.you.health
    // const head = request.you.body[0]

    // strat.push(dontCrash(board, head))
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

randomDirection = (directions) => {
    // directions looks like this: ['l','r','u','d']
    return directions[Math.floor(Math.random()*directions.length)]
}

//----------------------------
dontCrash = (board, head) => {
    // the basics of this is "Do not leave the map."
}