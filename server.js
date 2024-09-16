const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the app and middleware
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cors());

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST || 'localhost',
  database: 'task_manager',
  password: process.env.PG_PASS,
  port: process.env.PG_PORT || 5432,
});

// Routes

// GET /tasks - Retrieve all tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST /tasks - Add a new task
app.post('/tasks', async (req, res) => {
  const { title, description, priority, status, deadline } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, priority, status, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, priority, status, deadline]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// PUT /tasks/:id - Update an existing task
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, deadline } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, priority = $3, status = $4, deadline = $5 WHERE id = $6 RETURNING *',
      [title, description, priority, status, deadline, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send('Task Not Found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Task Not Found');
    }
    res.status(204).send(); // No content
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.use((err, req, res, next)=> {
    if (err) {
        console.error(err);
    }
    next(req, res);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
