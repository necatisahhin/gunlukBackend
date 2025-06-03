const prisma = require('../config/database');
const logger = require('../config/logger');

/**
 * Tüm içerikleri getir
 * @param {Object} filters - Filtreleme seçenekleri
 * @returns {Array} İçerikler listesi
 */
const getAllContents = async (filters = {}) => {
  try {
    const { category, tags } = filters;
    
    
    const where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags
      };
    }
    
    const contents = await prisma.content.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return contents;
  } catch (error) {
    logger.error('İçerikleri getirme başarısız: %o', error);
    throw error;
  }
};

/**
 * Belirli bir içeriği getir
 * @param {string} contentId - İçerik ID'si
 * @returns {Object} İçerik
 */
const getContentById = async (contentId) => {
  try {
    const content = await prisma.content.findUnique({
      where: {
        id: contentId
      }
    });
    
    if (!content) {
      const error = new Error('İçerik bulunamadı');
      error.statusCode = 404;
      throw error;
    }
    
    return content;
  } catch (error) {
    logger.error('İçerik getirme başarısız: %o', error);
    throw error;
  }
};

/**
 * Duygu durumuna göre içerik öner
 * @param {string} moodLabel - Duygu durumu etiketi
 * @returns {Array} Önerilen içerikler
 */
const getContentRecommendationsByMood = async (moodLabel) => {
  try {
    
    let categories = [];
    
    switch (moodLabel) {
      case 'mutlu':
        categories = ['motivasyon', 'yaratıcılık'];
        break;
      case 'üzgün':
        categories = ['rahatlama', 'motivasyon'];
        break;
      case 'kaygılı':
        categories = ['meditasyon', 'nefes', 'rahatlama'];
        break;
      case 'öfkeli':
        categories = ['sakinleşme', 'meditasyon'];
        break;
      default:
        categories = ['genel', 'meditasyon'];
    }
    
    
    const contents = await prisma.content.findMany({
      where: {
        category: {
          in: categories
        }
      },
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return contents;
  } catch (error) {
    logger.error('İçerik önerisi getirme başarısız: %o', error);
    throw error;
  }
};

module.exports = {
  getAllContents,
  getContentById,
  getContentRecommendationsByMood
}; 