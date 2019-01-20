exports.printBoard = (board) => {
    let b = board
    let f = filler
    //this just prints the board to the console
    b.forEach((y)=>{
        let yrow = '|'
        y.forEach((x)=>{
            if (x.traversable) {filler = '`'}
            while (x.content.length<5){
                x.content = x.content + filler
            }
            yrow = yrow + x.content + '|'
        })
        console.log(yrow)
        let line = ''
        while(line.length<yrow.length){
            line = line + '-'
        }
        console.log(line)
    })
}