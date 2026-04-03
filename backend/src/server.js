const app = require('./app');
const env = require('./config/env');
const { syncDatabase } = require('./models');

async function bootstrap() {
  try {
    await syncDatabase();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`API rodando na porta ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Falha ao iniciar API:', error.message);
    process.exit(1);
  }
}

bootstrap();
