//this sets a snake priority and determines what the snake should do
module.exports.buildPriority = (request, board) =>{
    //self-actualization - Can I kill right now?
    //esteem - Status needs. be the big snake and eat as much as possible
    //love/belonging - come in for a kiss on other shorter snakes if possible. Get your head near theirs.
    //safety - Avoid threat spaces
    //physiological - Get food and stay alive
    
    
    
    //assess food need
    //assess food convenience
    //assess other snake food need. Can I get a hungrier snake's food first?
    //can I trap another snake in a small space?
    //
    // this should return a list of strategy objects that we can filter/reduce later
    let strat = [
        {direction:"left", name:"foodHoarding", moves:4, risk:20, confidence:100},
        {direction:"left", name:"spanner", moves:10, risk:30, confidence:6}]
    return strat
}