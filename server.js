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
    const { title, release_year, genre, director } = req.body;
    const result = await pool.query(
      'INSERT INTO movies (title, release_year, genre, director) VALUES ($1,$2,$3,$4) RETURNING *',
      [title, release_year, genre, director]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});

app.get('/', (req,res) => res.send('Server is running!'));