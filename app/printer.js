exports.printBoard = (board) => {
    let b = board
    //this just prints the board to the console
    b.forEach((y)=>{
        let yrow = '|'
        y.forEach((x)=>{
            while (x.content.length<5){
                x.content = x.content + ' '
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