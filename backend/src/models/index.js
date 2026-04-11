const sequelize = require('../config/database');
const User = require('./User');
const PasswordHistory = require('./PasswordHistory');

User.hasMany(PasswordHistory, {
  foreignKey: 'userId',
  as: 'passwordHistory',
});

PasswordHistory.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

async function syncDatabase() {
  await sequelize.authenticate();
  await sequelize.sync();
}

module.exports = {
  sequelize,
  User,
  PasswordHistory,
  syncDatabase,
};
