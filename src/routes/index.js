const express = require('express');
const authRoutes = require('./auth-routes');
const journalRoutes = require('./journal-routes');
const contentRoutes = require('./content-routes');

const router = express.Router();


router.get('/status', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API çalışıyor',
    timestamp: new Date()
  });
});


router.use('/auth', authRoutes);
router.use('/journals', journalRoutes);
router.use('/contents', contentRoutes);

module.exports = router;