/*
f -food

H -my head
B -my body
T -my tail

h -other snake head
b -body
t -other snake tail

d -danger locations
*/

module.exports.buildBoard = (boardData) => {
 
    //poi means point of interest. It is an object with minumum an x and y key

    board = makeEmptyGrid(boardData.board.width, boardData.board.height)

    //write all food to grid
    boardData.board.food.forEach(food => {
        board = writePoint(board, food, "f")
    });
    
    //write all snakes to grid
    enemyHeads = []
    enemyTails = []
    boardData.board.snakes.forEach(snake=>{
        if(snake.id != boardData.you.id){
            //draw enemy snakes
            snake.body.forEach((bod, i)=>{
                if(i===0){
                    //save the length with the head so we know if it is orthoganal threat
                    let head = bod
                    head["length"] = snake.body.length
                    //write the head to the board
                    board = writePoint(board, bod, "h")
                    //add heads to heads array
                    enemyHeads.push(bod)
                } else if (i===snake.body.length-1){
                    //draw tail
                    board = writePoint(board, bod, "t")
                    //add tails to enemy tails array. Later we can decide if they re
                    enemyTails.push(bod)
                } else {
                    //draw body
                    board = writePoint(board, bod, "b")
                } 
            })
        } else {
            //draw your snake
            snake.body.forEach((bod, i)=>{
                if(i===0){
                    //draw head
                    board = writePoint(board, bod, "H")
                } else if (i===snake.body.length-1){
                    //draw tail
                    board = writePoint(board, bod, "T")
                } else{
                    //draw body
                    board = writePoint(board, bod, "B")
                }
            })
        }
    })
    //check for danger zones
    enemyHeads.forEach(head=>{
        if(head.length >= boardData.you.body.length){
            //snake is your equal or longer.
            board = markOrthoganalDanger(board, head)
        }
    })
    // todo: check enemy tail positions for multiple body stacked up or potential threat because they are about to eat
    return board
}

markOrthoganalDanger= (board, poi) => {
    //make a list of points within boundaries and also not "body points"
    let orth = getOrthoganalPoints(board, poi)
        .filter(p=>{
            //remove body points marked with b from this list
            if(atLocation(board, p) === 'b'){
                return false
            } else return true
        })

    //every point remaining in orth should be marked as a threat.
    orth.forEach(p=>{
        board = writePoint(board, p, 'd')
    })
    return board
}

getOrthoganalPoints= (board, poi) => {
    // make predictable list with invalid elements
    return [
        {x:poi.x+1, y:poi.y},
        {x:poi.x-1, y:poi.y},
        {x:poi.x, y:poi.y+1},
        {x:poi.x, y:poi.y-1}
    ].filter(p=>{
        //remove all of the invalid elements
        if(p.x<0 || p.y<0 || p.y===board.length || p.x===board[0].length){
            return false
        } else return true
    })
}

writePoint= (board, poi, letter) => {
    //concatenate the new letter onto the string
    board[poi.y][poi.x].content = board[poi.y][poi.x].content + letter
    return board
}

atLocation= (board, poi) => {
    //what is the thing at this x and y?
    return board[poi.y][poi.x]
}

makeEmptyGrid= (width, height) => {
   //construct a 2D array to fill with stuff
   let board = []
   for(let y=0; y<height ;y++){
       let col = []
       for(let x=0; x<width; x++){
           col.push({x:x, y:y, content:''})
       }
       board.push(col)
   }
   return board
}