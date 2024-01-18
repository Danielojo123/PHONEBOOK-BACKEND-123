const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = 30015;

// Configure Morgan to log both 'tiny' and 'combined' formats
app.use(morgan('tiny'));
app.use(morgan('combined'));
app.use(cors());

// Define a custom token for Morgan to log request body
morgan.token('req-body', (req) => JSON.stringify(req.body));

// Use the custom token in the Morgan middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

let phonebookEntries = [
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
];

app.use(express.json()); // Parse JSON requests

app.get('/info', (req, res) => {
  const currentTime = new Date();
  const formattedTime = currentTime.toISOString(); // Format the time as a string

  const info = `
    <p>The phonebook has info for ${phonebookEntries.length} people.</p>
    <p>Request received at: ${formattedTime}</p>
  `;

  res.send(info);
});

app.get('/api/persons', (req, res) => {
  res.json(phonebookEntries);
});

app.get('/api/persons/:id', (req, res) => {
  const idToFind = parseInt(req.params.id);
  const entry = phonebookEntries.find(entry => entry.id === idToFind);

  if (entry) {
    res.json(entry);
  } else {
    res.status(404).json({ error: 'Entry not found' });
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id);
  phonebookEntries = phonebookEntries.filter(entry => entry.id !== idToDelete);
  res.status(204).end(); // Respond with a success status and no content
});

// Route to handle POST requests for adding new phonebook entries
app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name and number are required' });
  }

  const existingEntry = phonebookEntries.find(entry => entry.name === body.name);

  if (existingEntry) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const newEntry = {
    id: Math.floor(Math.random() * 1000000), // Generate a new random id
    name: body.name,
    number: body.number
  };

  phonebookEntries = phonebookEntries.concat(newEntry);
  res.json(newEntry);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
