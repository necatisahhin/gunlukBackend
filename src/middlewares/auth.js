const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../config/logger');
const prisma = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Yetkilendirme başarısız. Token bulunamadı.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true }
      });
      
      if (!user) {
        return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      logger.error('Token doğrulama hatası: %o', error);
      return res.status(401).json({ message: 'Geçersiz token.' });
    }
  } catch (error) {
    logger.error('Kimlik doğrulama hatası: %o', error);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { authenticate }; 