const contentService = require('../services/content-service');
const logger = require('../config/logger');

/**
 * Tüm içerikleri getir
 * @param {Object} req - İstek nesnesi
 * @param {Object} res - Yanıt nesnesi
 * @param {Function} next - Sonraki middleware
 */
const getAllContents = async (req, res, next) => {
  try {
    const { category, tags } = req.query;
    
    
    const filters = {};
    
    if (category) {
      filters.category = category;
    }
    
    if (tags) {
      filters.tags = tags.split(',');
    }
    
    const contents = await contentService.getAllContents(filters);
    
    res.status(200).json({
      status: 'success',
      results: contents.length,
      data: {
        contents
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Belirli bir içeriği getir
 * @param {Object} req - İstek nesnesi
 * @param {Object} res - Yanıt nesnesi
 * @param {Function} next - Sonraki middleware
 */
const getContentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const content = await contentService.getContentById(id);
    
    res.status(200).json({
      status: 'success',
      data: {
        content
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Duygu durumuna göre içerik öner
 * @param {Object} req - İstek nesnesi
 * @param {Object} res - Yanıt nesnesi
 * @param {Function} next - Sonraki middleware
 */
const getRecommendationsByMood = async (req, res, next) => {
  try {
    const { moodLabel } = req.params;
    
    const contents = await contentService.getContentRecommendationsByMood(moodLabel);
    
    res.status(200).json({
      status: 'success',
      results: contents.length,
      data: {
        contents
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContents,
  getContentById,
  getRecommendationsByMood
}; 