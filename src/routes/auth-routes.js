const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth-controller');
const { validate } = require('../middlewares/validator');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();


router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Geçerli bir e-posta adresi giriniz'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Şifre en az 6 karakter olmalıdır'),
    body('name')
      .optional()
      .isLength({ min: 2 })
      .withMessage('İsim en az 2 karakter olmalıdır')
  ],
  validate,
  authController.register
);


router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Geçerli bir e-posta adresi giriniz'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Şifre en az 6 karakter olmalıdır')
  ],
  validate,
  authController.login
);


router.get('/profile', authenticate, authController.getProfile);

module.exports = router; 