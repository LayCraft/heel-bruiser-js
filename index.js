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
  let board = new Board(request.body)
  console.log(board.directions.map(direction=>direction.direction))
  if(board.directions.length<=1){
    const data = {
      //one move take it
      move: board.directions[0].direction || 'up'
    }
    return response.json(data)
  } else {
    // determine rankings on directions.
    let overallGoodness = {'up':0,'down':0,'left':0,'right':0}  
    let allocation = 0
    let dirColl = []
    
    try{
      //Rank for area
      allocation = 4
      board.directions.map(direction=>{
        return [direction.areaCount, direction.direction]
      }).sort((a,b)=>{
        if(a[0]>b[0]) return 1
        if(a[0]<b[0]) return -1
        if(a[0]===b[0]) return 0
      }).forEach(direction=>{
        overallGoodness[direction[1]] = overallGoodness[direction[1]] + allocation
        allocation--
      })
    } catch (err) {
      console.log(err)
    }

    try{
      //Rank for incentives
      allocation = 4
      dirColl = board.directions.map(direction=>{
        return [direction.incentives, direction.direction]
      }).filter(direction=>{
        //no reducing an array with no elements
        if( !direction[0]){ return false } else return true
      }).map(direction=>{
        console.log(direction)
        direction[0] = direction[0].reduce((prev, curr)=> prev+curr)
        return direction
      }).sort((a,b)=>{
        if(a[0]>b[0]) return 1
        if(a[0]<b[0]) return -1
        if(a[0]===b[0]) return 0
      })
      for(let i=0; i<dirColl.length; i++){
        // console.log(overallGoodness[dirColl[i][1]])
        overallGoodness[dirColl[i][1]] = overallGoodness[dirColl[i][1]] + allocation
        //only derement if the next space has a different value
        if(dirColl[i+1]&&dirColl[i+1][0]!=dirColl[i][0]){
          allocation--
        }
      }
    } catch(err) {
      console.log(err)
    }

    try{
      //rank for danger avoiding
      allocation = 4
      dirColl = board.directions.map(direction=>{
        return [direction.dangers
          .map(danger=>{
          return Math.abs(direction.x-danger.x) + Math.abs(direction.y-danger.y)
        }).reduce((prev, curr)=> prev+curr), direction.direction]
      }).sort((a,b)=>{
        if(a[0]>b[0]) return -1
        if(a[0]<b[0]) return 1
        if(a[0]===b[0]) return 0
      })
      for(let i=0; i<dirColl.length; i++){
        // console.log(overallGoodness[dirColl[i][1]])
        overallGoodness[dirColl[i][1]] = overallGoodness[dirColl[i][1]] + allocation
        //only derement if the next space has a different value
        if(dirColl[i+1]&&dirColl[i+1][0]!=dirColl[i][0]){
          allocation--
        }
      }
    } catch(err) {
      console.log(err)
    }

    try{
      //increase goodness for undangerous locations
      board.directions.forEach(direction=>{ !direction.danger ? overallGoodness[direction.direction]+=10 : false})
    } catch(err){
      console.log(err)
    }

    try{
      //increase goodness for food locations
      board.directions.forEach(direction=>{ direction.food ? overallGoodness[direction.direction]+=5 : false})
    } catch(err){
      console.log(err)
    }
    
    // Response data
    const data = {
      //go the direction of the key in overallGoodness with the greatest accumulated value. Tie picks the last evaluated.
      move: Object.keys(overallGoodness).reduce((a, b) => overallGoodness[a] > overallGoodness[b] ? a : b), // one of: ['up','down','left','right']
    }
    console.log("Going " + data.move)
    return response.json(data)
  }
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
