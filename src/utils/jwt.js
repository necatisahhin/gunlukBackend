const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * JWT token oluşturur
 * @param {Object} payload - Token içeriği
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

module.exports = {
  generateToken
}; 