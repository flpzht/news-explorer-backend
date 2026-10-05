const Article = require('../models/article');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user._id });
    res.send(articles);
  } catch (err) {
    next(err);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const article = await Article.create({ ...req.body, owner: req.user._id });
    res.status(201).send(article);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Dados inválidos para o artigo'));
      return;
    }
    next(err);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.articleId)
      .select('+owner')
      .orFail(new NotFoundError('Artigo não encontrado'));

    if (!article.owner.equals(req.user._id)) {
      throw new ForbiddenError('Você não pode excluir artigos de outro usuário');
    }

    await article.deleteOne();
    res.send({ message: 'Artigo excluído com sucesso' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Id de artigo inválido'));
      return;
    }
    next(err);
  }
};

module.exports = { getArticles, createArticle, deleteArticle };
