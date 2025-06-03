const bcrypt = require('bcrypt');

/**
 * Şifreyi hashler
 * @param {string} password - Hashlenecek şifre
 * @returns {Promise<string>} Hashlenmiş şifre
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Şifre karşılaştırması yapar
 * @param {string} password - Karşılaştırılacak düz metin şifre
 * @param {string} hashedPassword - Karşılaştırılacak hashlenmiş şifre
 * @returns {Promise<boolean>} Eşleşme sonucu
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
}; 