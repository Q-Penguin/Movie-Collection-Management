const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
 user: 'qiyunchen',
 host: 'localhost',
 database: 'movie_collection',
 password: 'Cranbrook1',
 port: 5432
});

app.get('/api/movies', async (req, res) => {
 try {
 const result = await pool.query('SELECT * FROM movies');
 res.json(result.rows);
 } catch (err) {
 res.status(500).json({ error: err.message });
 }
});

app.post('/api/movies', async (req, res) => {
  try {
    const { title, release_year, genre, duration } = req.body;
    if (!title || !release_year || !genre || !duration) {
      return res.status(400).json({ error: 'Missing movie data' });
    }
    const result = await pool.query(
      'INSERT INTO movies (title, release_year, genre, duration) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, release_year, genre, duration]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);  // <-- Check terminal for the actual error
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, release_year, genre, duration } = req.body;
    const result = await pool.query(
      'UPDATE movies SET title=$1, release_year=$2, genre=$3, duration=$4 WHERE movie_id=$5 RETURNING *',
      [title, release_year, genre, duration, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM movies WHERE movie_id=$1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reviews');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});

app.get('/', (req,res) => res.send('Server is running!'));