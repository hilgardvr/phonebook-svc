const Person = require('./mongo')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(function (tokens, req, res) {
  const method = req.method
  const body = req.method === "POST" ? JSON.stringify(req.body) : ""
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    body
  ].join(' ')
}))

app.get('/', (req, res) => {
    res.send('<h1>Index</h1>')
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(err => next(err))
})

app.get('/info', (req, res, next) => {
  const date = new Date()
  const length = Person.find({})
    .then(persons => {
        res.send(`
          <p>Phonebook has info for ${persons.length} people</p>
          <p>${date}</p>
        `)
      })
      .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id.toString()
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => {
      next(err)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' } )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(err => next(err) )
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id.toString()
  Person.findByIdAndRemove(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
  res.status(204).end()
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
  .catch(err => next(err))
})

const errorHandler = (error, req, res, next) => {
  if (error && error.name == "CastError") {
    return res.status(400).send({error: 'malformed id'})
  }
  if (error && error.name == "ValidationError") {
    return res.status(400).send({error: error.message})
  }
  next(error)
}

app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})