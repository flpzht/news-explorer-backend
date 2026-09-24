const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'O campo email é obrigatório'],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'O campo password é obrigatório'],
    select: false,
    minlength: 8,
  },
  name: {
    type: String,
    required: [true, 'O campo name é obrigatório'],
    minlength: [2, 'O campo name deve ter pelo menos 2 caracteres'],
    maxlength: [30, 'O campo name deve ter menos de 30 caracteres'],
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Incorrect email or password'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Incorrect email or password'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
