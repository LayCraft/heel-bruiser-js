printBoard = (board) => {
    let b = board
    //this just prints the board to the console
    b.forEach((y)=>{
        let yrow = '|'
        y.forEach((x)=>{
            // console.log(x)
            let f = '~'
            if (x.traversable) {f = ' '}
            while (x.content.length<7){
                x.content = x.content + f
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