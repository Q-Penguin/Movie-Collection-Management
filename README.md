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
Movie-Collection-Management/
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

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)

### Installation
1. Clone or download this repository to your local machine.

2. Navigate to the project directory:
   ```
   cd Movie-Collection-Management
   ```

3. Install the required Node.js dependencies:
   ```
   npm install
   ```

### Database Setup
1. Ensure PostgreSQL is running on your system.

2. Create a new database and run the SQL script:
   - Open your PostgreSQL client (e.g., psql or pgAdmin)
   - Create a database named `movie_collection`
   - Run the contents of `database.sql` to create tables and insert sample data

3. Update database credentials in `server.js` if necessary:
   - Modify the `pool` configuration with your PostgreSQL username, password, and database name

### Running the Application
1. Start the backend server:
   ```
   node server.js
   ```
   The server will run on `http://localhost:3000`

2. Open `index.html` in your web browser to access the frontend interface.

3. The application should now be running. You can add movies, view reviews, and manage your collection through the web interface.

### API Endpoints
- GET `/api/movies` - Retrieve all movies
- POST `/api/movies` - Add a new movie
- PUT `/api/movies/:id` - Update a movie
- DELETE `/api/movies/:id` - Delete a movie
- GET `/api/reviews` - Retrieve all reviews
- POST `/api/reviews` - Add a new review

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