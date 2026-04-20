const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// psql connection
const pool = new Pool({
  user: 'qiyunchen',
  host: 'localhost',
  database: 'movie_collection',
  password: 'Cranbrook1',
  port: 5432
});

// movies

// GET all movies
app.get('/api/movies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve movies' });
  }
});

// GET movie by ID
app.get('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM movies WHERE movie_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve movie' });
  }
});

// POST new movie
app.post('/api/movies', async (req, res) => {
  const { title, release_year, genre, duration } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'title is required' });
  }
  if (release_year === undefined || release_year === null) {
    return res.status(400).json({ error: 'release_year is required' });
  }
  if (typeof release_year !== 'number' || release_year < 1888 || release_year > 2100) {
    return res.status(400).json({ error: 'release_year must be a number between 1888 and 2100' });
  }
  if (!genre || genre.trim() === '') {
    return res.status(400).json({ error: 'genre is required' });
  }
  if (duration === undefined || duration === null) {
    return res.status(400).json({ error: 'duration is required' });
  }
  if (typeof duration !== 'number' || duration <= 0 || duration > 1200) {
    return res.status(400).json({ error: 'duration must be a positive number (max 1200 minutes)' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO movies (title, release_year, genre, duration) VALUES ($1, $2, $3, $4) RETURNING *',
      [title.trim(), release_year, genre.trim(), duration]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create movie' });
  }
});

// PUT update movie by ID
app.put('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, release_year, genre, duration } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'title is required' });
  }
  if (release_year === undefined || release_year === null) {
    return res.status(400).json({ error: 'release_year is required' });
  }
  if (typeof release_year !== 'number' || release_year < 1888 || release_year > 2100) {
    return res.status(400).json({ error: 'release_year must be a number between 1888 and 2100' });
  }
  if (!genre || genre.trim() === '') {
    return res.status(400).json({ error: 'genre is required' });
  }
  if (duration === undefined || duration === null) {
    return res.status(400).json({ error: 'duration is required' });
  }
  if (typeof duration !== 'number' || duration <= 0 || duration > 1200) {
    return res.status(400).json({ error: 'duration must be a positive number (max 1200 minutes)' });
  }

  try {
    const result = await pool.query(
      'UPDATE movies SET title=$1, release_year=$2, genre=$3, duration=$4 WHERE movie_id=$5 RETURNING *',
      [title.trim(), release_year, genre.trim(), duration, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

// DELETE movie by ID
app.delete('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM movies WHERE movie_id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

// GET all reviews for a specific movie
app.get('/api/movies/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;

    // movie exists
    const movieCheck = await pool.query('SELECT * FROM movies WHERE movie_id = $1', [id]);
    if (movieCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const result = await pool.query(`
      SELECT r.review_id, r.rating, r.review_text, r.review_date,
             u.name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.movie_id = $1
      ORDER BY r.review_date DESC
    `, [id]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve reviews for movie' });
  }
});

//GET poster
app.get('/api/movies/:id/poster', async (req, res) => {
  try {
    const { id } = req.params;

    const dbResult = await pool.query(
      'SELECT title, release_year FROM movies WHERE movie_id = $1',
      [id]
    );

    if (dbResult.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const movie = dbResult.rows[0];

    const apiKey = 'a752ad66';
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(movie.title)}&y=${movie.release_year}&apikey=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({ error: 'Public API request failed' });
    }

    const data = await response.json();

    res.json({
      title: movie.title,
      poster: data.Poster,
      imdbRating: data.imdbRating,
      plot: data.Plot
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch movie info' });
  }
});

// reviews

// GET all reviews
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
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
});

// GET review by ID
app.get('/api/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT r.review_id, r.rating, r.review_text, r.review_date,
             m.title AS movie_title,
             u.name AS user_name
      FROM reviews r
      JOIN movies m ON r.movie_id = m.movie_id
      JOIN users u ON r.user_id = u.user_id
      WHERE r.review_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve review' });
  }
});

// POST new review
app.post('/api/reviews', async (req, res) => {
  const { movie_id, user_id, rating, review_text } = req.body;

  if (movie_id === undefined || movie_id === null) {
    return res.status(400).json({ error: 'movie_id is required' });
  }
  if (typeof movie_id !== 'number') {
    return res.status(400).json({ error: 'movie_id must be a number' });
  }
  if (user_id === undefined || user_id === null) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  if (typeof user_id !== 'number') {
    return res.status(400).json({ error: 'user_id must be a number' });
  }
  if (rating === undefined || rating === null) {
    return res.status(400).json({ error: 'rating is required' });
  }
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be a number between 1 and 5' });
  }
  if (review_text !== undefined && typeof review_text !== 'string') {
    return res.status(400).json({ error: 'review_text must be a string' });
  }

  try {
    // movie exists
    const movieCheck = await pool.query('SELECT * FROM movies WHERE movie_id = $1', [movie_id]);
    if (movieCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await pool.query(
      'INSERT INTO reviews (movie_id, user_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [movie_id, user_id, rating, review_text || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// PUT update review by ID
app.put('/api/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const { rating, review_text } = req.body;

  if (rating === undefined || rating === null) {
    return res.status(400).json({ error: 'rating is required' });
  }
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be a number between 1 and 5' });
  }
  if (review_text !== undefined && typeof review_text !== 'string') {
    return res.status(400).json({ error: 'review_text must be a string' });
  }

  try {
    // review exists
    const reviewCheck = await pool.query('SELECT * FROM reviews WHERE review_id = $1', [id]);
    if (reviewCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await pool.query(
      'UPDATE reviews SET rating=$1, review_text=$2 WHERE review_id=$3',
      [rating, review_text || null, id]
    );

    const result = await pool.query(`
      SELECT r.review_id, r.rating, r.review_text, r.review_date,
             m.title AS movie_title, u.name AS user_name
      FROM reviews r
      JOIN movies m ON r.movie_id = m.movie_id
      JOIN users u ON r.user_id = u.user_id
      WHERE r.review_id = $1
    `, [id]);

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE review by ID
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM reviews WHERE review_id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// users

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY join_date DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// GET user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

// POST new user
app.post('/api/users', async (req, res) => {
  const { name, email, age } = req.body;

  // Required field checks
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'name is required' });
  }
  if (!email || email.trim() === '') {
    return res.status(400).json({ error: 'email is required' });
  }
  //email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'email must be a valid email address' });
  }
  if (age !== undefined && age !== null) {
    if (typeof age !== 'number' || age < 0 || age > 120) {
      return res.status(400).json({ error: 'age must be a number between 0 and 120' });
    }
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
      [name.trim(), email.trim(), age || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    // Catch duplicate email at DB level
    if (err.code === '23505') {
      return res.status(400).json({ error: 'A user with that email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT update user by ID
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'name is required' });
  }
  if (!email || email.trim() === '') {
    return res.status(400).json({ error: 'email is required' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'email must be a valid email address' });
  }
  if (age !== undefined && age !== null) {
    if (typeof age !== 'number' || age < 0 || age > 120) {
      return res.status(400).json({ error: 'age must be a number between 0 and 120' });
    }
  }

  try {
    const result = await pool.query(
      'UPDATE users SET name=$1, email=$2, age=$3 WHERE user_id=$4 RETURNING *',
      [name.trim(), email.trim(), age || null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'A user with that email already exists' });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE user_id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.get('/', (req, res) => res.send('Server is running!'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});