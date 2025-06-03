const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/error-handler');
const logger = require('./config/logger');


const app = express();


app.use(helmet()); 
app.use(morgan('dev', { stream: { write: message => logger.info(message.trim()) } })); 
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use('/api/v1', routes);


app.use(notFoundHandler);


app.use(errorHandler);

module.exports = app; 