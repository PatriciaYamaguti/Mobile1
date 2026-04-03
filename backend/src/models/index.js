const sequelize = require('../config/database');
const User = require('./User');

async function syncDatabase() {
  await sequelize.authenticate();
  await sequelize.sync();
}

module.exports = {
  sequelize,
  User,
  syncDatabase,
};
