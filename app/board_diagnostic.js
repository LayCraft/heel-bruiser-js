module.exports.atLocation = (board, poi) => {
    //what is the thing at this x and y?
    return board[poi.y][poi.x]
}
module.exports.bestRouteBetweenPoints = () => {
    //the route that will put you in the best survival area
    //best means most room to grow, most food, and least threats
}
module.exports.getOrthoganalPoints= (board, poi) => {
    let x = poi.x
    let y = poi.y
    // make predictable list with invalid elements
    orth = [
        //direction is away from the supplied point
        {x: x+1, y: y, direction:'right'},
        {x: x-1, y: y, direction:'left'},
        {x: x, y: y+1, direction:'down'},
        {x: x, y: y-1, direction:'up'}
    ].filter(p=>{
        //remove all of the invalid elements
        if(p.x<0 || p.y<0 || p.y===board.length || p.x===board[0].length){
            return false
        } else return true
    })
    console.log(orth)
    //later return because of debugging
    return orth
}

module.exports.inventoryArea = (board, poi) => {
    // console.log(board)
    //flood fill traversable area and return the points and their distance for diagnostics
    //this takes the point sample on the board and returns all traversable points and a count of threats, and food.
    let checked = []
    // let unchecked =[{x:poi.x, y:poi.y}]
    let traversable = [] // the final collection of points that can be navigated
    let heads = 0
    let tails = 0
    let food = 0
    let threats = 0

    //keep looping until all unchecked become checked
    while(unchecked.length>0){
        let p = unchecked.pop() //only gives x and y
        //only check unchecked locations
        if(!checked.includes(p)){
            // console.log("This is the point.")
            // console.log(p)
            //collect all orth points from the examined one.
            // printBoard(board)
            // console.log("this is the board")
            // console.log(board[0][0])
         
            

            // console.log(getOrthoganalPoints(board, p))
            // .forEach(point => {
            //     //save traversible points
            //     if (point.traversible) traversible.push(point)
            //     console.log("POINT!" + point)
            // });
        } else {
            console.log("Space was already checked")
        }
    }

    poi['inventoryArea'] = {
        traversible:0,
        threats:0,
        food:0,
        heads:0,
        tails:0
    }
    return poi
}
exports.randomDirection = (directions) => {
    // directions looks like this: ['left','right','up','down']
    return directions[Math.floor(Math.random()*directions.length)]
}
module.exports.routeBetweenPoints = (board, poi1, poi2) => {
    //find the distance between two points and return the route
    //the first element in the returned array should be the first move
}



