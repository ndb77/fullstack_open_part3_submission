require("dotenv").config();
const { query } = require("express");
const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

// app.use(morgan.token('combined', function (req, res) { return req.headers['content-type'] }));
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.get("/", (request, response) => {
  response.send("<h1>Hello</h1>");
});

app.get("/api/persons", (request, response,next) => {
  Person.find({}).then((persons) => {
    // Person.find returns an array matching search params
    response.json(persons); // persons is set to that array, and is set as the response
  })
  .catch(error=>next(error));
});

app.get("/api/persons/:id", (request, response,next) => {
  const id = request.params.id;
  Person.findById(id).then((person) => {
    response.json(person);
  })
  .catch(error=>next(error));
});

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    // Person.find returns an array matching search params
    response.send(`
    <p>Phonebook has enteries for ${persons.length} people<p>
    <p> Date: ${new Date()}</p>
    `);
  });
});

app.delete("/api/persons/:id", (request, response,next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      // deleting person
      Person.find({}).then((persons) => {
        // retrieving new db
        response.status(204).end();
      });
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response,next) => {
  const body = request.body;
  let valid_request = true;
  if (body.name === undefined || body.number === undefined) {
    valid_request = false;
    return response.status(400).json({
      error: "content missing",
    });
  }
  if (valid_request) {
    const new_person = new Person({
      name: body.name,
      number: body.number,
      date: new Date(),
    });
    new_person.save({new:true}).then((savedPerson) => {
      // console.log(response.send(savedPerson).data);
      response.send(savedPerson)
    });
  }
})

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const new_number = request.body.number;
  const person = {
    name: request.body.name,
    number: request.body.number,
  };
  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => { // By default, updatedPerson recieves the original document w/o modifications
                               // setting {new:true} makes it so that the updatedPerson recieves the new modified document
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
