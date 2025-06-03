const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');
const prisma = require('./config/database');


async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    logger.info('Veritabanı bağlantısı başarılı');
    return true;
  } catch (error) {
    logger.error('Veritabanı bağlantı hatası: %o', error);
    return false;
  }
}


async function startServer() {
  const dbConnected = await checkDatabaseConnection();
  
  if (!dbConnected && config.env === 'production') {
    logger.error('Veritabanı bağlantısı kurulamadı, uygulama başlatılamıyor');
    process.exit(1);
  }
  
  const server = app.listen(config.port, () => {
    logger.info(`Server ${config.env} modunda çalışıyor`);
    logger.info(`http://localhost:${config.port}/api/v1/status adresinden erişilebilir`);
  });
  
  
  process.on('uncaughtException', (error) => {
    logger.error('Yakalanmamış istisna: %o', error);
    gracefulShutdown();
  });
  
  process.on('unhandledRejection', (error) => {
    logger.error('İşlenmemiş promise reddi: %o', error);
    gracefulShutdown();
  });
  
  
  function gracefulShutdown() {
    logger.info('Uygulama güvenli bir şekilde kapatılıyor...');
    
    server.close(async () => {
      logger.info('HTTP sunucusu kapatıldı');
      
      
      await prisma.$disconnect();
      logger.info('Veritabanı bağlantısı kapatıldı');
      
      process.exit(1);
    });
    
    
    setTimeout(() => {
      logger.error('Güvenli kapatma zaman aşımına uğradı, zorla kapatılıyor');
      process.exit(1);
    }, 10000);
  }
  
  
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

startServer(); 