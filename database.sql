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

--I am annoyed that this is like a certain somebody's so I am going to change data from what I presented in class DO NOT JUDGE

INSERT INTO Movies (title, release_year, genre, duration) VALUES
('Interstellar', 2014, 'Sci-Fi', 169),
('Parasite', 2019, 'Thriller', 132),
('Inception', 2010, 'Sci-Fi', 148),
('La La Land', 2016, 'Musical', 128),
('The Social Network', 2010, 'Drama', 120),
('Avengers: Endgame', 2019, 'Action', 181),
('The Matrix', 1999, 'Sci-Fi', 136),
('Titanic', 1997, 'Romance', 195),
('Jurassic Park', 1993, 'Adventure', 127),
('The Lion King', 1994, 'Animation', 88),
('Gladiator', 2000, 'Action', 155),
('Spider-Man: Into the Spider-Verse', 2018, 'Animation', 117),
('Whiplash', 2014, 'Drama', 106),
('The Grand Budapest Hotel', 2014, 'Comedy', 99),
('Mad Max: Fury Road', 2015, 'Action', 120);

INSERT INTO Users (name, email, age, join_date) VALUES
('Alina Yuan', 'ayuan26@cranbrook.edu', 18, '2023-02-11'),
('Michelle Xu', 'mxu26@cranbrook.edu', 18, '2023-03-03'),
('Lisa Li', 'sli26@cranbrook.edu', 18, '2023-04-18'),
('Bob', 'bob@cranbrook.edu', 31, '2023-05-07'),
('Bubba', 'bubba@cranbrook.edu', 26, '2023-06-22'),
('Dr. Reynolds', 'kreynolds@cranbrook.edu', 21, '2023-01-10'), --forever 21
('Qiqi', 'qiqi@cranbrook.edu', 17, '2023-02-15'),
('Ryan Wei', 'hwei26@cranbrook.edu', 18, '2023-03-20'),
('Justin Seo', 'jseo26@cranbrook.edu', 19, '2023-04-05'),
('Qiyun Chen', 'qchen26@cranbrook.edu', 17, '2023-05-12'),
('Kenneth Hu', 'khu26@cranbrook.edu', 17, '2023-06-18'),
('Leena Kraytem', 'lkraytem26@cranbrook.edu', 17, '2023-07-01'),
('Daniella Gan', 'dgan26@cranbrook.edu', 17, '2023-07-20'),
('Andy Yu', 'ayu27@cranbrook.edu', 16, '2023-08-10'),
('Bob2', 'bob2@cranbrook.edu', 30, '2023-09-03');

INSERT INTO Reviews (movie_id, user_id, rating, review_text, review_date) VALUES
(1, 1, 5, 'Mind-blowing visuals and emotional story.', '2023-07-10'),
(2, 2, 5, 'Brilliant social commentary and suspense.', '2023-07-12'),
(3, 3, 4, 'Very creative concept and stunning effects.', '2023-07-15'),
(4, 4, 4, 'Beautiful music and great performances.', '2023-07-18'),
(5, 5, 5, 'Fascinating look at the rise of Facebook.', '2023-07-20'),
(1, 2, 4, 'Complex but rewarding to watch.', '2023-07-22'),
(2, 3, 5, 'One of the most unique sci-fi movies ever.', '2023-07-25'),
(1, 2, 5, 'Epic conclusion to the Marvel saga.', '2023-09-10'),
(2, 3, 5, 'Revolutionary sci-fi movie with amazing action.', '2023-09-12'),
(3, 4, 4, 'Classic romance with unforgettable moments.', '2023-09-14'),
(4, 5, 5, 'Dinosaurs brought to life perfectly.', '2023-09-16'),
(5, 1, 5, 'A childhood favorite with beautiful music.', '2023-09-18'),
(6, 6, 4, 'Powerful story and incredible battles.', '2023-09-20'),
(7, 7, 5, 'One of the best animated superhero films.', '2023-09-22'),
(8, 8, 5, 'Intense and inspiring musical drama.', '2023-09-24'),
(9, 9, 4, 'Unique storytelling and great visuals.', '2023-09-26'),
(10, 10, 5, 'Non-stop action and stunning cinematography.', '2023-09-28'),
(1, 3, 4, 'Great action and emotional moments.', '2023-10-01'),
(2, 4, 5, 'Still holds up incredibly well.', '2023-10-03'),
(6, 2, 4, 'Epic historical drama.', '2023-10-05'),
(8, 5, 5, 'Outstanding performances and soundtrack.', '2023-10-07'),
(10, 1, 5, 'Adrenaline-filled masterpiece.', '2023-10-09');
