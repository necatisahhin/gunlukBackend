const prisma = require('../config/database');
const { generateToken } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/password');
const logger = require('../config/logger');

/**
 * Kullanıcı kaydı
 * @param {Object} userData - Kullanıcı verileri
 * @returns {Object} Kullanıcı ve token bilgileri
 */
const register = async (userData) => {
  try {
    
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      const error = new Error('Bu e-posta adresi zaten kullanılıyor');
      error.statusCode = 400;
      throw error;
    }

    
    const hashedPassword = await hashPassword(userData.password);

    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name
      }
    });

    
    const { password, ...userWithoutPassword } = user;

    
    const token = generateToken({ id: user.id });

    return {
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    logger.error('Kullanıcı kaydı başarısız: %o', error);
    throw error;
  }
};

/**
 * Kullanıcı girişi
 * @param {string} email - Kullanıcı e-postası
 * @param {string} password - Kullanıcı şifresi
 * @returns {Object} Kullanıcı ve token bilgileri
 */
const login = async (email, password) => {
  try {
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      const error = new Error('Geçersiz e-posta veya şifre');
      error.statusCode = 401;
      throw error;
    }

    
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('Geçersiz e-posta veya şifre');
      error.statusCode = 401;
      throw error;
    }

    
    const { password: _, ...userWithoutPassword } = user;

    
    const token = generateToken({ id: user.id });

    return {
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    logger.error('Kullanıcı girişi başarısız: %o', error);
    throw error;
  }
};

module.exports = {
  register,
  login
}; 