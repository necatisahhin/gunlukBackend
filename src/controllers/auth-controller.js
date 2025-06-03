const authService = require('../services/auth-service');
const logger = require('../config/logger');

/**
 * Kullanıcı kaydı
 * @param {Object} req - İstek nesnesi
 * @param {Object} res - Yanıt nesnesi
 * @param {Function} next - Sonraki middleware
 */
const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await authService.register(userData);
    
    res.status(201).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Kullanıcı girişi
 * @param {Object} req - İstek nesnesi
 * @param {Object} res - Yanıt nesnesi
 * @param {Function} next - Sonraki middleware
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Kullanıcı profili
 * @param {Object} req - İstek nesnesi
 * @param {Object} res - Yanıt nesnesi
 */
const getProfile = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};

module.exports = {
  register,
  login,
  getProfile
}; 