"use strict"

const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')

const Board = require('./app/board') //The board related module

const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game
  // Response data
  const data = {
    color: '#00ffff',
  }
  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move
  const board = new Board(request.body)
  const directions = board.directions
    .map(direction=>{
      // each incentive gets assigned a list of moves to get there instead of just a coordinate so we can determine how long it is
      direction.incentives = direction.incentives
        .map(incentive=>{
          //todo: this needs to be limited to a heuristic so that only near spaces get evaluated
          console.log("incentive", incentive)
          return board.routeTo(direction, incentive)
        })
    return direction
  })
  
  // determine rankings on directions.
  // console.log(directions)
  

  let overallGoodness = {'up':0,'down':0,'left':0,'right':0}

  //points for greatest area
  let maxVal = 0
  let maxWays = []
  for (let d of directions){
    if (!maxWays[0]){
      //if no element in array initiate the array
      maxWays.push(d.direction)
      maxVal = d.areaCount
    } else if(d.areaCount>maxVal){
      //the area count is greater than the values we have so we set the greatest way list and update 
      maxWays = [d.direction]
      maxVal = d.areaCount
    } else if(d.areaCount===maxVal){
      //we have a match. Push the element.
      maxWays.push(d.direction)
    }
    //who cares about anything that is less than other directions?
  }
  for (let i of maxWays){
    overallGoodness[i] = overallGoodness[i] + 1
  }

  // //points for most tails in direction
  // maxVal = 0
  // maxWays = []
  // for (let d of directions){
  //   if (!maxWays[0]){
  //     //if no element in array initiate the array
  //     maxWays.push(d.direction)
  //     maxVal = d.tails
  //   } else if(d.tails>maxVal){
  //     //the tail count is greater than the values we have so we set the greatest way list and update 
  //     maxWays = [d.direction]
  //     maxVal = d.tails
  //   } else if(d.tails===maxVal){
  //     //we have a match. Push the element.
  //     maxWays.push(d.direction)
  //   }
  //   //who cares about anything that is less than other directions?
  // }
  // for (let i of maxWays){
  //   overallGoodness[i] = overallGoodness[i] + 1
  // }

  // //points for least number of danger spaces
  // let minVal = 9999999999
  // let minWays = []
  // for (let d of directions){
  //   if (!minWays[0]){
  //     //if no element in array initiate the array
  //     minWays.push(d.direction)
  //     minVal = d.dangers.length
  //   } else if(d.dangers.length<minVal){
  //     //the tail count is greater than the values we have so we set the greatest way list and update 
  //     minWays = [d.direction]
  //     minVal = d.dangers.length
  //   } else if(d.dangers.length===minVal){
  //     //we have a match. Push the element.
  //     minWays.push(d.direction)
  //   }
  //   //who cares about anything that is more than other directions?
  // }
  // for (let i of maxWays){
  //   overallGoodness[i] = overallGoodness[i] + 1
  // }

  // //points for most incentives
  // maxVal = 0
  // maxWays = []
  // for (let d of directions){
  //   if (!maxWays[0]){
  //     //if no element in array initiate the array
  //     maxWays.push(d.direction)
  //     maxVal = d.incentives.length
  //   } else if(d.incentives.length>maxVal){
  //     //the tail count is greater than the values we have so we set the greatest way list and update 
  //     maxWays = [d.direction]
  //     maxVal = d.incentives.length
  //   } else if(d.incentives.length===maxVal){
  //     //we have a match. Push the element.
  //     maxWays.push(d.direction)
  //   }
  //   //who cares about anything that is less than other directions?
  // }
  // for (let i of maxWays){
  //   overallGoodness[i] = overallGoodness[i] + 1
  // }

  //points for nearest incentive
  // maxVal = 0
  // maxWays = []
  // for (let d of directions){
  //   if (!maxWays[0]){
  //     //if no element in array initiate the array
  //     maxWays.push(d.direction)
  //     maxVal = d.incentives.length 
    // TODO: needs to be mapped filtered and reduced into the length of each route. This may change later after I convert each route find into a distance to point although this is a critical part of the main strategy
  //   } else if(d.incentives.length>maxVal){
  //     //the tail count is greater than the values we have so we set the greatest way list and update 
  //     maxWays = [d.direction]
  //     maxVal = d.incentives.length
  //   } else if(d.incentives.length===maxVal){
  //     //we have a match. Push the element.
  //     maxWays.push(d.direction)
  //   }
  //   //who cares about anything that is less than other directions?
  // }
  // for (let i of maxWays){
  //   overallGoodness[i] = overallGoodness[i] + 1
  // }
  
  //points for having incentive in first move
  // maxVal = 0
  // maxWays = []
  // for (let d of directions){
  //   if (!maxWays[0]){
  //     //if no element in array initiate the array
  //     maxWays.push(d.direction)
  //     maxVal = d.incentives.length 
    // TODO: needs to be mapped filtered and reduced into the length of each route. Then we can look for 1 lenght moves in a more efficient way
  //   } else if(d.incentives.length>maxVal){
  //     //the tail count is greater than the values we have so we set the greatest way list and update 
  //     maxWays = [d.direction]
  //     maxVal = d.incentives.length
  //   } else if(d.incentives.length===maxVal){
  //     //we have a match. Push the element.
  //     maxWays.push(d.direction)
  //   }
  //   //who cares about anything that is less than other directions?
  // }
  // for (let i of maxWays){
  //   overallGoodness[i] = overallGoodness[i] + 1
  // }
  
  // Response data
  const data = {
    //go the direction of the key in overallGoodness with the greatest accumulated value. Tie picks the last evaluated.
    move: Object.keys(overallGoodness).reduce((a, b) => overallGoodness[a] > overallGoodness[b] ? a : b), // one of: ['up','down','left','right']
  }
  console.log("Going " + data.move)
  
  return response.json(data)
})

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
