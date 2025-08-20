const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const upload = require('../middleware/upload'); // il middleware multer

const router = express.Router();

// Registrazione e login
router.post('/register', validateRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', authMiddleware, AuthController.getProfile);

// Nuova route per upload immagine profilo
// Usa authMiddleware per protezione + upload.single per singolo file
router.post(
  '/profile-image',
  authMiddleware,
  upload.single('profile_image'),
  AuthController.updateProfileImage
);

module.exports = router;
