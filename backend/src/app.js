const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const passwordHistoryRoutes = require('./routes/passwordHistoryRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/', authRoutes);
app.use('/', passwordHistoryRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Rota nao encontrada: ${req.method} ${req.originalUrl}` });
});

module.exports = app;
