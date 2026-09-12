require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/persons')

morgan.token(
  'body', (req) => {
    if (req.method === 'POST' || req.method === 'PUT') {
      return Object.keys(req.body || {}).length ? JSON.stringify(req.body) : ''
    }
    return ''
  }
)

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const info = `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `
    response.send(info)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  response.status(404).end()
})

app.post('/api/persons', (request, response) => {
  response.status(501).end()
})

app.delete('/api/persons/:id', (request, response) => {
  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})