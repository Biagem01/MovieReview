
const { body } = require('express-validator');

const validateRegistration = [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateReview = [
  body('movie_id')
    .isInt()
    .withMessage('Movie ID must be a number'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review_text')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Review text must not exceed 1000 characters')
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateReview
};
