const dotenv = require('dotenv');

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];

  if (!value || value.trim() === '') {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
  }

  return value;
}

module.exports = {
  port: Number(process.env.PORT) || 3333,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'pass_generator',
    username: process.env.DB_USER || 'postgres',
    password: requireEnv('DB_PASSWORD'),
  },
  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};
