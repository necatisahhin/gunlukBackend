const express = require('express');
const contentController = require('../controllers/content-controller');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();


router.get('/', contentController.getAllContents);


router.get('/recommendations/:moodLabel', authenticate, contentController.getRecommendationsByMood);


router.get('/:id', contentController.getContentById);

module.exports = router; 