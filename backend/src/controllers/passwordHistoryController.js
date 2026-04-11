const { PasswordHistory } = require('../models');
const {
  encodeSimplePassword,
  decodeSimplePassword,
} = require('../utils/simplePasswordHash');

async function savePassword(req, res) {
  try {
    const { appName, password } = req.body;
    const normalizedAppName = String(appName || '').trim();
    const normalizedPassword = String(password || '');

    if (!normalizedAppName || !normalizedPassword) {
      return res.status(400).json({ message: 'Campos obrigatorios: appName e password' });
    }

    const entry = await PasswordHistory.create({
      userId: req.user.sub,
      appName: normalizedAppName,
      passwordHash: encodeSimplePassword(normalizedPassword),
    });

    return res.status(201).json({
      id: entry.id,
      appName: entry.appName,
      password: decodeSimplePassword(entry.passwordHash),
      createdAt: entry.createdAt,
      message: 'Senha salva com sucesso',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao salvar senha' });
  }
}

async function listPasswords(req, res) {
  try {
    const entries = await PasswordHistory.findAll({
      where: { userId: req.user.sub },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(
      entries.map((entry) => ({
        id: entry.id,
        appName: entry.appName,
        password: decodeSimplePassword(entry.passwordHash),
        createdAt: entry.createdAt,
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao listar historico' });
  }
}

async function deletePassword(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Id invalido' });
    }

    const entry = await PasswordHistory.findOne({
      where: {
        id,
        userId: req.user.sub,
      },
    });

    if (!entry) {
      return res.status(404).json({ message: 'Senha nao encontrada' });
    }

    await entry.destroy();
    return res.status(200).json({ message: 'Senha excluida com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao excluir senha' });
  }
}

module.exports = {
  savePassword,
  listPasswords,
  deletePassword,
};
