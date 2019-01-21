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
    })    

    //write all snakes to grid
    enemyHeadsTailLength = []
    //save the length with the head so we know if it is orthoganal threat
    boardData.board.snakes.forEach(snake=>{
        if(snake.id != boardData.you.id){
            //push the head and tail into the collection as a pair
            enemyHeadsTailLength.push([snake.body[0],snake.body[snake.body.length-1], snake.body.length])
        }
    })    

    boardData.board.snakes.forEach(snake=>{
        if(snake.id != boardData.you.id){
            //draw enemy snakes
            snake.body.forEach((bod, i)=>{
                if(i===0){
                    //write the head to the board
                    board = writePoint(board, bod, "h")
                } else if (i===snake.body.length-1){
                    //draw tail
                    board = writePoint(board, bod, "t")
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
    enemyHeadsTailLength.forEach(headTailLength=>{
        if(headTailLength[2] >= boardData.you.body.length){
            //snake is your equal or longer.
            board = markOrthoganalDanger(board, headTailLength[0])
        }

        //how many food are by the mouth of the snake?
        getOrthoganalPoints(board, headTailLength[0]).forEach(mouthPoi=>{                    

            //if there are any foods in the mouth zone then mark the tail with a danger d
           if(atLocation(board, mouthPoi).includes('f')){
               board = writePoint(board, headTailLength[1], '!')
           }
        })

    })
    // the tail of my snake should be considered dangerous because food could spawn there
    return board
}

const markOrthoganalDanger= (board, poi) => {
    //make a list of points within boundaries and also not "body points"
    let orth = getOrthoganalPoints(board, poi)
        .filter(p=>{
            //remove body points marked with b from this list
            if(atLocation(board, p).includes('b')){
                return false
            } else return true
        })

    //every point remaining in orth should be marked as a threat.
    orth.forEach(p=>{
        board = writePoint(board, p, '!')
    })
    return board
}

const getOrthoganalPoints= (board, poi) => {
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

const writePoint= (board, poi, letter) => {
    //concatenate the new letter onto the string
    board[poi.y][poi.x].content = board[poi.y][poi.x].content + letter
    if( board[poi.y][poi.x].content.includes('B') || 
        board[poi.y][poi.x].content.includes('b') || 
        board[poi.y][poi.x].content.includes('h')){
        // body sections and heads are definitely not traversable
        board[poi.y][poi.x].traversable = false
    } else if (board[poi.y][poi.x].content.includes('t') && board[poi.y][poi.x].content.includes('b')){
        //if the tail has an extra body segment traversability is false
        board[poi.y][poi.x].traversable = false
    } else {
        //food and lone tails are traversable
        board[poi.y][poi.x].traversable = true
    }
    return board
}

atLocation= (board, poi) => {
    //what is the thing at this x and y?
    return board[poi.y][poi.x]
}

const makeEmptyGrid= (width, height) => {
   //construct a 2D array to fill with stuff
   let board = []
   for(let y=0; y<height ;y++){
       let col = []
       for(let x=0; x<width; x++){
           col.push({x:x, y:y, content:'', traversable:true})
       }
       board.push(col)
   }
   return board
}