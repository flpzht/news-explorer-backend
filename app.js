require('dotenv').config({ quiet: true });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');

const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/newsexplorerdb',
} = process.env;

const allowedCors = [
  'https://flp-news-explorer',
  'https://www.flp-news-explorer',
  'http://localhost:5173',
  'http://localhost:3000',
];

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

const app = express();

mongoose.connect(MONGO_URL)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err.message));

app.use(helmet());

app.use(cors({
  origin: allowedCors,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(limiter);
app.use(express.json());

app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
