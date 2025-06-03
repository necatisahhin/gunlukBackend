const express = require('express');
const { body } = require('express-validator');
const journalController = require('../controllers/journal-controller');
const { validate } = require('../middlewares/validator');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();


router.use(authenticate);


router.post(
  '/',
  [
    body('text')
      .notEmpty()
      .withMessage('Günlük metni boş olamaz')
      .isLength({ min: 10 })
      .withMessage('Günlük metni en az 10 karakter olmalıdır')
  ],
  validate,
  journalController.createEntry
);


router.get('/', journalController.getUserEntries);


router.get('/analytics/mood', journalController.getMoodAnalytics);


router.get('/:id', journalController.getEntryById);


router.delete('/:id', journalController.deleteEntry);

module.exports = router; 