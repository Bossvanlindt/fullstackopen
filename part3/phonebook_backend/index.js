const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(express.static("build"));
app.use(express.json());
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

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

app.get("/info", (request, response) => {
  const html = `<p>Phonebook has info for ${
    persons.length
  } people</p><p>${new Date()}</p>`;
  response.send(html);
});

app.get("/api/persons", (request, response) => response.json(persons));

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  person
    ? response.json(person)
    : response.status(404).json({ error: "person not found" });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number)
    return response.status(400).json({ error: "content missing" });
  if (persons.some((p) => p.name === body.name))
    return response.status(400).json({ error: "name must be unique" });

  const person = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

// Heroku sets the env PORT, so we use that on Heroku in production and default to 3001 in development
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));