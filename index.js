const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = 3001

app.use(express.json())
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

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Index</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const length = persons.length
  const date = new Date()
  res.send(`
    <p>Phonebook has info for ${length} people</p>
    <p>${date}</p>
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id.toString()
  const person = persons.find(p => p.id.toString() === id)
  if (!person) {
    res.status(404).end()
  } else {
    res.json(person)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id.toString()
  persons = persons.filter(p => p.id.toString() != id)
  res.status(204).end()
})

const generateId = () => {
  const max = persons.length > 0
    ? Math.max(...persons.map(p => p.id)) + 1
    : 0
  return max
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  const exsiting = persons.find(p => p.name === body.name)
  if (exsiting) {
    return res.status(400).json({
      error: 'name already exists'
    })
  }
  const id = generateId()
  const person = {
    id: id,
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  res.json(person)
})


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})