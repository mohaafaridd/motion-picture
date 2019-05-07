const User = require('../models/user');
const { getPopular } = require('./helpers/indexHelpers');
const listsHelpers = require('./helpers/listsHelpers');

const getHome = async (req, res) => {
  try {
    const { cachedUser } = req;
    cachedUser.isAnonymous = !!cachedUser.isAnonymous;
    const popular = await getPopular(cachedUser);
    const lists = cachedUser.isAnonymous ? [] : await listsHelpers.getListJSON(req, 'cachedUser');
    const hasList = lists.length !== 0;
    res.render('index', {
      title: 'Motion Picture',
      cachedUser,
      popular,
      options: lists,
      hasList,
      isLogged: !cachedUser.isAnonymous,
    });
  } catch (error) {
    res.redirect(req.header('Referer'));
  }
};

// Registeration page
const getRegister = async (req, res) => {
  res.render('index/register', { cachedUser: req.cachedUser });
};

// Register a user
const postRegister = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.cookie('auth', token, { maxAge: process.env.EXP_DATE });

    res.status(201).redirect('/');
    // res.redirect('/', 201);
  } catch (error) {
    res.status(400).render('index/register', { error, cachedUser: req.cachedUser });
  }
};

// Login page
const getLogin = async (req, res) => {
  res.render('index/login', { cachedUser: req.cachedUser });
};

// Login a user
const postLogin = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body);
    const token = await user.generateAuthToken();
    res.cookie('auth', token, { maxAge: process.env.EXP_DATE });
    res.status(200).redirect('/');
  } catch (error) {
    error.message = 'Wrong username, email or password.';
    res.status(400).render('index/login', { error, cachedUser: req.cachedUser });
  }
};

// Sign out
const postLogout = async (req, res) => {
  try {
    req.cachedUser.tokens = req.cachedUser.tokens
      .filter(token => token.token !== req.token);
    res.clearCookie('auth');
    await req.cachedUser.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).redirect(req.header('Referer'));
  }
};

module.exports = {
  getHome,
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  postLogout,
};
