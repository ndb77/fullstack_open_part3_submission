const { query } = require("express");
const express = require("express");
var morgan = require('morgan')
const app = express();

// app.use(morgan.token('combined', function (req, res) { return req.headers['content-type'] }));
app.use(morgan('combined'))
app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello</h1>");
});

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/api/persons/:id", (request, response) => {
  let query_response = persons.find((person) => {
    if (person.id === Number(request.params.id)) {
      return person;
    }
  });

  if (query_response == null) {
    response.status(404).end();
  } else {
    response.send(query_response);
  }
});

app.get("/info", (request, response) => {
  response.send(`
  <p>Phonebook has enteries for ${persons.length} people<p>
  <p> Date: ${new Date()}</p>
  `);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.send(persons);
});

const generateId = () => {
  return Math.floor(Math.random() * 100);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  let valid_request = true;
  if (!body.name || !body.number) {
    valid_request =false
    return response.status(400).json({
      error: "content missing",
    });
  }
  persons.forEach(person=>{
    if(body.name===person.name){
      valid_request =false
      return response.status(400).json({
        error: "name must be unique",
      }) 
    }
  })

  if(valid_request){
    const new_person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };
    persons = persons.concat(new_person)
    response.send(persons)
    morgan.apply()
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
