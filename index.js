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

  // determine rankings on directions.
  let overallGoodness = {'up':0,'down':0,'left':0,'right':0}  
  let allocation = 0

  //as health decreases increase value of food
  
  //Rank for area
  allocation = 4
  board.directions.map(direction=>{
    return [direction.area, direction.direction]
  }).sort((a,b)=>{
    if(a[0]>b[0]) return 1
    if(a[0]<b[0]) return -1
    if(a[0]===b[0]) return 0
  }).forEach(direction=>{
    overallGoodness[direction[1]] = overallGoodness[direction[1]] + allocation
    allocation--
  })
  //Rank for incentives
  allocation = 4
  board.directions.map(direction=>{
    return [direction.incentives.map(incentive=>{
      return Math.abs(direction.x-incentive.x) + Math.abs(direction.y-incentive.y)
    }).reduce((prev, curr)=> prev+curr), direction.direction]
  }).sort((a,b)=>{
    if(a[0]>b[0]) return 1
    if(a[0]<b[0]) return -1
    if(a[0]===b[0]) return 0
  }).forEach(direction=>{
    overallGoodness[direction[1]] = overallGoodness[direction[1]] + allocation
    allocation--
  })

  console.log(overallGoodness)


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
