const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const reviewLikeRoutes = require('./routes/reviewLikeRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5050;

// 🔹 CORS: permetti sia Vercel che localhost
const allowedOrigins = [
  "https://movie-review-alpha-red.vercel.app", // dominio Vercel del frontend
  "http://localhost:3000" // per sviluppo locale
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/review-likes', reviewLikeRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 🔹 Debug: lista delle route attive
const listRoutes = () => {
  if (!app._router) return;
  console.log('=== Lista di tutte le route attive ===');

  const printStack = (stack, prefix = '') => {
    stack.forEach((middleware) => {
      if (middleware.route) {
        console.log(`${prefix}Route: ${middleware.route.path} | Metodi: ${Object.keys(middleware.route.methods).join(', ')}`);
      } else if (middleware.name === 'router' && middleware.handle.stack) {
        printStack(middleware.handle.stack, prefix + '  ');
      }
    });
  };

  printStack(app._router.stack);
  console.log('=== Fine lista ===');
};
listRoutes();

// Avvio server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend Render running on port ${PORT}`);
});
