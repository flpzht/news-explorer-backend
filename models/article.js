const mongoose = require('mongoose');
const validadtor = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, 'O campo keyword é obrigatório'],
  },
  title: {
    type: String,
    required: [true, 'O campo title é obrigatório'],
  },
  text: {
    type: String,
    required: [true, 'O campo text é obrigatório'],
  },
  date: {
    type: String,
    required: [true, 'O campo date é obrigatório'],
  },
  source: {
    type: String,
    required: [true, 'O campo source é obrigatório'],
  },
  link: {
    type: String,
    required: [true, 'O campo link é obrigatório'],
    validate: {
      validator: (v) => validadtor.isURL(v),
      message: '{VALUE} is not a valid URL',
    },
  },
  image: {
    type: String,
    required: [true, 'O campo image é obrigatório'],
    validate: {
      validator: (v) => validadtor.isURL(v),
      message: '{VALUE} is not a valid URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
}, { versionKey: false });

module.exports = mongoose.model('article', articleSchema);
