exports.randomDirection = (directions) => {
    // directions looks like this: ['left','right','up','down']
    return directions[Math.floor(Math.random()*directions.length)]
}
module.exports.routeBetweenPoints = (board, poi1, poi2) => {
    //find the distance between two points and return the route
    //the first element in the returned array should be the first move
}
module.exports.bestRouteBetweenPoints = () => {
    //the route that will put you in the best survival area
    //best means most room to grow, most food, and least threats
}
module.exports.inventoryArea = (board, poi) => {
    //flood fill traversable area and return the points and their distance for diagnostics
    //return [{x:1, y:2, distance: 5, content: 'fd'}]
    //distance requires routebetween points

 
    //this takes the point sample on the board and returns all traversable points and a count of threats, and food.
    let checked = []
    let unchecked ={[poi.x, poi.y]:{x:poi.x, y:poi.y}}
    
    let traversable = [] // the final collection of points that can be navigated
    //keep looping until all unchecked become checked
    while(unchecked.length>0){
        let p = unchecked.pop()
        //only check unchecked locations
        if(!checked.includes({x:p.x, y:p.x})){
        }
    }
}

module.exports.atLocation= (board, poi) => {
    //what is the thing at this x and y?
    return board[poi.y][poi.x].content
}

module.exports.getOrthoganalPoints= (board, poi) => {
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