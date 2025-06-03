const prisma = require('../config/database');
const logger = require('../config/logger');
const geminiApi = require('../utils/gemini-api');

/**
 * Yeni günlük girişi oluştur
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} text - Günlük metni
 * @returns {Object} Oluşturulan günlük ve duygu analizi
 */
const createJournalEntry = async (userId, text) => {
  try {
    
    const journalEntry = await prisma.journalEntry.create({
      data: {
        text,
        userId
      }
    });

    
    const moodAnalysis = await geminiApi.analyzeMood(text);

    
    const createdAnalysis = await prisma.moodAnalysis.create({
      data: {
        journalEntryId: journalEntry.id,
        moodLabel: moodAnalysis.moodLabel,
        moodScore: moodAnalysis.moodScore,
        analysis: moodAnalysis.analysis,
        suggestions: moodAnalysis.suggestions
      }
    });

    
    await prisma.moodAnalytic.create({
      data: {
        userId,
        moodLabel: moodAnalysis.moodLabel,
        moodScore: moodAnalysis.moodScore
      }
    });

    
    return {
      journalEntry,
      moodAnalysis: createdAnalysis
    };
  } catch (error) {
    logger.error('Günlük girişi oluşturma başarısız: %o', error);
    throw error;
  }
};

/**
 * Kullanıcının günlük girişlerini getir
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Array} Günlük girişleri listesi
 */
const getUserJournalEntries = async (userId) => {
  try {
    const entries = await prisma.journalEntry.findMany({
      where: {
        userId
      },
      include: {
        moodAnalysis: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return entries;
  } catch (error) {
    logger.error('Günlük girişlerini getirme başarısız: %o', error);
    throw error;
  }
};

/**
 * Belirli bir günlük girişini getir
 * @param {string} entryId - Günlük giriş ID'si
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Object} Günlük girişi
 */
const getJournalEntryById = async (entryId, userId) => {
  try {
    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        userId
      },
      include: {
        moodAnalysis: true
      }
    });

    if (!entry) {
      const error = new Error('Günlük girişi bulunamadı');
      error.statusCode = 404;
      throw error;
    }

    return entry;
  } catch (error) {
    logger.error('Günlük girişi getirme başarısız: %o', error);
    throw error;
  }
};

/**
 * Kullanıcının duygu durumu analizlerini getir
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Array} Duygu durumu analizleri
 */
const getUserMoodAnalytics = async (userId) => {
  try {
    const analytics = await prisma.moodAnalytic.findMany({
      where: {
        userId
      },
      orderBy: {
        date: 'desc'
      }
    });

    return analytics;
  } catch (error) {
    logger.error('Duygu durumu analizlerini getirme başarısız: %o', error);
    throw error;
  }
};

/**
 * Günlük girişini sil
 * @param {string} entryId - Günlük giriş ID'si
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Object} Silinen günlük girişi
 */
const deleteJournalEntry = async (entryId, userId) => {
  try {
    
    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: entryId,
        userId
      }
    });

    if (!entry) {
      const error = new Error('Günlük girişi bulunamadı');
      error.statusCode = 404;
      throw error;
    }

    
    await prisma.moodAnalysis.deleteMany({
      where: {
        journalEntryId: entryId
      }
    });

    
    const deletedEntry = await prisma.journalEntry.delete({
      where: {
        id: entryId
      }
    });

    return deletedEntry;
  } catch (error) {
    logger.error('Günlük girişi silme başarısız: %o', error);
    throw error;
  }
};

module.exports = {
  createJournalEntry,
  getUserJournalEntries,
  getJournalEntryById,
  getUserMoodAnalytics,
  deleteJournalEntry
}; 