const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')

const boardBuild = require('./app/board') //The board related module
const printer = require('./app/printer') //The printers

const priorityBuild = require('./app/priority') //Generates a priority string

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
    color: '#FED348',
  }
  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {
  // NOTE: Do something here to generate your move
  
  //construct a board
  
  const board = boardBuild.buildBoard(request.body)
  const priorities = priorityBuild.buildPriority(request.body, board)
  console.log(priorities)
  printer.printBoard(board) //printing pads the content of each cell. :-( remove before deploy

  // console.log(request.body)
  // Response data
  const data = {
    move: 'up', // one of: ['up','down','left','right']
  }

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
