const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models');
const { isValidEmail } = require('../utils/validators');
const { hashPassword, verifyPassword } = require('../utils/password');

function buildToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

async function signup(req, res) {
  try {
    const { name, email, password, repeatPassword } = req.body;

    if (!name || !email || !password || !repeatPassword) {
      return res.status(400).json({
        message: 'Campos obrigatorios: name, email, password, repeatPassword',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email fora do padrao valido' });
    }

    if (password !== repeatPassword) {
      return res.status(400).json({ message: 'As senhas devem ser iguais' });
    }

    const emailAlreadyExists = await User.findOne({
      where: { email: String(email).toLowerCase().trim() },
    });

    if (emailAlreadyExists) {
      return res.status(409).json({ message: 'Este email ja foi cadastrado' });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash: hashPassword(password),
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      message: 'Usuario criado com sucesso',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao cadastrar usuario' });
  }
}

async function signin(req, res) {
  try {
    const source = req.method === 'GET' ? req.query : req.body;
    const { email, password } = source;

    if (!email || !password) {
      return res.status(400).json({ message: 'Campos obrigatorios: email e password' });
    }

    const user = await User.findOne({
      where: { email: String(email).toLowerCase().trim() },
    });

    if (!user) {
      return res.status(404).json({ message: 'E-mail nao cadastrado.' });
    }

    const passwordMatches = verifyPassword(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = buildToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao autenticar' });
  }
}

async function signout(_req, res) {
  return res.status(200).json({
    message: 'Logout realizado. No JWT stateless, basta remover o token no cliente.',
  });
}

module.exports = {
  signup,
  signin,
  signout,
};
