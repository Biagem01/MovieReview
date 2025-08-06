
-- Database creation
CREATE DATABASE IF NOT EXISTS movie_review_db;
USE movie_review_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Movies table (cache from TMDB API)
CREATE TABLE movies (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    poster_path VARCHAR(255),
    backdrop_path VARCHAR(255),
    release_date DATE,
    vote_average DECIMAL(3,1),
    vote_count INT,
    genre_ids JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_movie (user_id, movie_id)
);

-- Favorites table
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_movie_favorite (user_id, movie_id)
);

-- Watchlist table
CREATE TABLE watchlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_movie_watchlist (user_id, movie_id)
);

CREATE TABLE review_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  review_id INT NOT NULL,
  user_id INT NOT NULL,
  is_like BOOLEAN NOT NULL, -- true = like, false = dislike
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_review (user_id, review_id),
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,            -- destinatario notifica
  sender_id INT NOT NULL,          -- chi ha generato l'evento (es. ha messo like)
  review_id INT DEFAULT NULL,      -- riferimento alla recensione coinvolta
  type VARCHAR(50) NOT NULL,       -- tipo notifica, es: 'like_review'
  message TEXT NOT NULL,           -- testo personalizzato
  is_read BOOLEAN DEFAULT FALSE,   -- stato lettura
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (review_id) REFERENCES reviews(id)
);


-- Indexes for better performance
CREATE INDEX idx_reviews_movie_id ON reviews(movie_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX idx_movies_title ON movies(title);
