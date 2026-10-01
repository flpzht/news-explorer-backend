const router = require('express').Router();

const auth = require('../middlewares/auth');
const { validateSignup, validateSignin } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');

const userRoutes = require('./users');
const articleRoutes = require('./articles');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);

router.use('/users', auth, userRoutes);
router.use('/articles', auth, articleRoutes);

router.use((req, res, next) => next(new NotFoundError('Rota não encontrada')));

module.exports = router;
