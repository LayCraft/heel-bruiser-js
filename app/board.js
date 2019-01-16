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
    
    //write all snakes to grid
    enemyHeads = []
    boardData.board.snakes.forEach(snake=>{
        if(snake.id != boardData.you.id){
            //draw enemy snakes
            snake.body.forEach((bod, i)=>{
                if(i===0){
                    //save the length with the head so we know if it is orthoganal threat
                    let head = bod
                    head["length"] = snake.body.length
                    //add heads to heads array
                    enemyHeads.push(bod)
                }
                //draw body like normal
                board = writePoint(board, bod.x, bod.y, "b")
                
            })
        } else {
            //draw your snake
            snake.body.forEach((bod, i)=>{
                if(i===0){
                    //draw head
                    board = writePoint(board, bod.x, bod.y, "H")
                }else if (i===snake.body.length-1){
                    //draw tail
                    board = writePoint(board, bod.x, bod.y, "t")
                }else{
                    //draw body
                    board = writePoint(board, bod.x, bod.y, "b")
                }
            })
        }
    })

    //TODO: draw enemy head
    console.log(enemyHeads)
    console.log(board)
}

writePoint= (board, x, y, contents) => {
    board[y][x]=contents
    return board
}