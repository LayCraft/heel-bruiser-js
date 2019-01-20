routeBetweenPoints = (board, poi1, poi2) => {
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
}