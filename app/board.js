/*
f -food
b -body
H -my head
d -danger locations
*/
module.exports.buildBoard = (boardData) => {
    //construct a 2D array 
    let board = []
    for(let y=0; y<boardData.board.height ;y++){
        let col = []
        for(let x=0; x<boardData.board.width; x++){
            col.push([])
        }
        board.push(col)
    }
    //write all food to grid
    boardData.board.food.forEach(food => {
        board = writePoint(board, food.x, food.y, "f")
    });
    
    let enemyHeads = []
    //write all snakes to grid
    boardData.board.snakes.forEach(snake=>{
        if(snake.id != boardData.you.id){
            //draw enemy snakes
            snake.body.forEach(bod=>{
                board = writePoint(board, bod.x, bod.y, "b")
            })
        } else {
            //draw your snake
            //draw enemy snakes
            snake.body.forEach(bod=>{
                board = writePoint(board, bod.x, bod.y, "B")
            })
        }
    })

    console.log(board)
}

writePoint= (board, x, y, contents) => {
    board[y][x]=contents
    return board
}