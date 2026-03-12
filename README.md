# Movie Collection and Reviews

A full-stack web application for managing a personal movie collection and writing reviews. Users can add movies, write reviews, and rate films.

## Features

- **Movie Management**: Add, edit, and delete movies from your collection
- **Review System**: Write detailed reviews and rate movies on a 1-5 star scale
- **User Management**: Associate reviews with different users
- **Responsive Design**: Clean, professional UI that works on desktop screens

## Format

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Frontend**: HTML

## Project Structure

```
movie-collection/
├── backend/
│   ├── server.js        
│   └── package.json       
├── frontend/
│   ├── index.html        
│   ├── styles.css      
│   └── script.js        
├── database/
│   └── database.sql     
└── README.md           
```

### Request/Response Examples

**Add a Movie (POST /api/movies)**:
```json
{
  "title": "Inception",
  "release_year": 2010,
  "genre": "Sci-Fi",
  "duration": 148
}
```

**Add a Review (POST /api/reviews)**:
```json
{
  "movie_id": 1,
  "user_id": 1,
  "rating": 5,
  "review_text": "Mind-bending masterpiece!"
}
```

## Author

Qiyun Chen

## License

This project is created for educational purposes as part of a course assignment.