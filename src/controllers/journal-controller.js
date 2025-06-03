const journalService = require('../services/journal-service');
const logger = require('../config/logger');

/**
 * Yeni günlük girişi oluştur
 * @param {Object} req - İstek nesnesi
 * @param {Object} res - Yanıt nesnesi
 * @param {Function} next - Sonraki middleware
 */
const createEntry = async (req, res, next) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;
    
    const result = await journalService.createJournalEntry(userId, text);
    
    res.status(201).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Kullanıcının günlük girişlerini getir
 * @param {Object} req - İstek nesnesi
 * @param {Object} res - Yanıt nesnesi
 * @param {Function} next - Sonraki middleware
 */
const getUserEntries = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const entries = await journalService.getUserJournalEntries(userId);
    
    res.status(200).json({
      status: 'success',
      results: entries.length,
      data: {
        entries
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Belirli bir günlük girişini getir
 * @param {Object} req - İstek nesnesi
 * @param {Object} res - Yanıt nesnesi
 * @param {Function} next - Sonraki middleware
 */
const getEntryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const entry = await journalService.getJournalEntryById(id, userId);
    
    res.status(200).json({
      status: 'success',
      data: {
        entry
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Kullanıcının duygu durumu analizlerini getir
 * @param {Object} req - İstek nesnesi
 * @param {Object} res - Yanıt nesnesi
 * @param {Function} next - Sonraki middleware
 */
const getMoodAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const analytics = await journalService.getUserMoodAnalytics(userId);
    
    res.status(200).json({
      status: 'success',
      results: analytics.length,
      data: {
        analytics
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Günlük girişini sil
 * @param {Object} req - İstek nesnesi
 * @param {Object} res - Yanıt nesnesi
 * @param {Function} next - Sonraki middleware
 */
const deleteEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    await journalService.deleteJournalEntry(id, userId);
    
    res.status(200).json({
      status: 'success',
      message: 'Günlük girişi başarıyla silindi'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEntry,
  getUserEntries,
  getEntryById,
  getMoodAnalytics,
  deleteEntry
}; 