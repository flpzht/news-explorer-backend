const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name });

    res.status(201).send({ _id: user._id, email: user.email, name: user.name });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Este email já está cadastrado'));
      return;
    }
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Dados inválidos no cadastro'));
      return;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );

    res.send({ token });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .orFail(new NotFoundError('Usuário não encontrado'));

    res.send({ email: user.email, name: user.name });
  } catch (err) {
    next(err);
  }
};

module.exports = { createUser, login, getCurrentUser };
