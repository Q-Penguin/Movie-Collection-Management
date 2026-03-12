CREATE DATABASE movie_collection;

\c movie_collection;

CREATE TABLE Movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year INTEGER,
    genre VARCHAR(100),
    duration INTEGER --in minutes
);

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INTEGER,
    join_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE Reviews (
    review_id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES Movies(movie_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_date DATE DEFAULT CURRENT_DATE
);

INSERT INTO Movies (title, release_year, genre, duration) VALUES
('The Shawshank Redemption', 1994, 'Drama', 142),
('The Godfather', 1972, 'Crime', 175),
('The Dark Knight', 2008, 'Action', 152),
('Pulp Fiction', 1994, 'Crime', 154),
('Forrest Gump', 1994, 'Drama', 142);

INSERT INTO Users (name, email, age, join_date) VALUES
('Alice Johnson', 'alice@example.com', 25, '2023-01-15'),
('Bob Smith', 'bob@example.com', 30, '2023-02-20'),
('Charlie Brown', 'charlie@example.com', 28, '2023-03-10'),
('Diana Prince', 'diana@example.com', 32, '2023-04-05'),
('Eve Wilson', 'eve@example.com', 26, '2023-05-12');

INSERT INTO Reviews (movie_id, user_id, rating, review_text, review_date) VALUES
(1, 1, 5, 'An incredible story of hope and friendship.', '2023-06-01'),
(2, 2, 5, 'A masterpiece of cinema.', '2023-06-05'),
(3, 3, 4, 'Great action and performances.', '2023-06-10'),
(4, 4, 5, 'Quentin Tarantino at his best.', '2023-06-15'),
(5, 5, 4, 'Heartwarming and inspiring.', '2023-06-20'),
(1, 2, 5, 'Timeless classic.', '2023-06-25'),
(2, 3, 4, 'Powerful storytelling.', '2023-07-01');