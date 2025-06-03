const logger = require('../config/logger');


const errorHandler = (err, req, res, next) => {
  logger.error('Hata yakalandı: %o', {
    error: err,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Sunucu hatası';
  
  return res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};


const notFoundHandler = (req, res, next) => {
  const err = new Error(`Bulunamadı - ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = {
  errorHandler,
  notFoundHandler
}; 