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
            col.push('')
        }
        board.push(col)
    }
    //write all food to grid
    boardData.board.food.forEach(food => {
        board = writePoint(board, food.x, food.y, "f")
    });
    
    //write all snakes to grid
    enemyHeads = []
    dangerousTails = []
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
                } else if (i===snake.body.length-1){
                    //tail
                } else {

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
                } else if (i===snake.body.length-1){
                    //draw tail
                    board = writePoint(board, bod.x, bod.y, "t")
                } else{
                    //draw body
                    board = writePoint(board, bod.x, bod.y, "b")
                }
            })
        }
    })
    //check for danger zones
    enemyHeads.forEach(head=>{
        if(head.length >= boardData.you.body.length){
            //snake is your equal or longer.
            board = markOrthoganalDanger(board, head.x, head.y)
        }
    })

    console.log(board)
    return board
}

markOrthoganalDanger= (board, x, y) => {
    //make a list of points within boundaries and also not "body points"
    let orth = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]
        .filter(point=>{
            //remove out of bounds points
            if(point[0]<0 || point[1]<0 || point[1]===board.length || point[0]===board[0].length){
                return false
            } else return true
        })
        .filter(point=>{
            //remove body points marked with b
            if( atLocation(board,point[0],point[1]) === 'b'){
                return false
            } else return true
        })
    //every point remaining in orth should be marked as a threat.
    orth.forEach(point=>{
        writePoint(board, point[0], point[1], 't')
    })
    return board
}

writePoint= (board, x, y, contents) => {
    //concatenate the new letter onto the string
    board[y][x]= board[y][x] + contents
    return board
}

atLocation= (board, x, y) => {
    //what is the thing at this x and y?
    return board[y][x]
}