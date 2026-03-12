const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//psql connection
const pool = new Pool({
 user: 'qiyunchen',
 host: 'localhost',
 database: 'movie_collection',
 password: 'Cranbrook1',
 port: 5432
});

//get movies
app.get('/api/movies', async (req, res) => {
 try {
 const result = await pool.query('SELECT * FROM movies');
 res.json(result.rows);
 } catch (err) {
 res.status(500).json({ error: err.message });
 }
});

//post movie
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

//put/update movie by id
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

//delete movie by id
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

//get all reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.review_id, r.rating, r.review_text, r.review_date,
             m.title AS movie_title,
             u.name AS user_name
      FROM reviews r
      JOIN movies m ON r.movie_id = m.movie_id
      JOIN users u ON r.user_id = u.user_id
      ORDER BY r.review_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY join_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//add new review
app.post('/api/reviews', async (req, res) => {
  try {
    const { movie_id, user_id, rating, review_text } = req.body;

    if (!movie_id || !user_id || !rating) {
      return res.status(400).json({ error: 'Missing required review data' });
    }

    const result = await pool.query(
      'INSERT INTO reviews (movie_id, user_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [movie_id, user_id, rating, review_text]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// update review
app.put('/api/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const { rating, review_text } = req.body;

  try {
    // Update the review first
    await pool.query(
      'UPDATE reviews SET rating=$1, review_text=$2 WHERE review_id=$3',
      [rating, review_text, id]
    );

    // Return the updated review with movie title and user name
    const result = await pool.query(`
      SELECT r.review_id, r.rating, r.review_text, r.review_date,
             m.title AS movie_title, u.name AS user_name
      FROM reviews r
      JOIN movies m ON r.movie_id = m.movie_id
      JOIN users u ON r.user_id = u.user_id
      WHERE r.review_id = $1
    `, [id]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// delete review
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM reviews WHERE review_id=$1 RETURNING *', [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Review not found' });

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// post a new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const result = await pool.query(
      'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
      [name, email, age || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    const result = await pool.query(
      'UPDATE users SET name=$1, email=$2, age=$3 WHERE user_id=$4 RETURNING *',
      [name, email, age, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE user_id=$1 RETURNING *', [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//start server
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});

app.get('/', (req,res) => res.send('Server is running!'));