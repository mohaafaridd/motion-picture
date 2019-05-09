const validator = require('validator');
const User = require('../models/user');
const { getPopular } = require('./helpers/indexHelpers');
const listsHelpers = require('./helpers/listsHelpers');

const getHome = async (req, res) => {
  try {
    const { cachedUser } = req;
    cachedUser.isAnonymous = !!cachedUser.isAnonymous;
    const popular = await getPopular(cachedUser);
    const lists = cachedUser.isAnonymous ? [] : await listsHelpers.getListJSON(cachedUser, cachedUser);
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
  try {
    // Validation Inputs
    const {
      name,
      nickname,
      email,
      password,
    } = req.body;

    // Length of name
    if (name.trim().length < 2 || name.trim().length > 32) {
      throw new Error('Name have length between 2 and 32 characters');
    }

    // Name regex validation
    const nameRegex = /^[a-zA-Z][a-z-A-Z ]+[a-zA-Z]$/;
    if (!nameRegex.test(name.trim())) {
      throw new Error('Name must be charaters and spaces only');
    }

    // Nickname length validation
    if (nickname.trim().length < 2 || nickname.trim().length > 15) {
      throw new Error('Nickname have length between 2 and 32 characters');
    }

    // Nickname regex validation
    const nicknameRegex = /^\w([-.]?\w)+\w$/;
    if (!nicknameRegex.test(nickname.trim())) {
      throw new Error('Nickname must be charaters, dots and dashes only');
    }

    // Nickname availability
    if (await User.findOne({ nickname: nickname.trim() })) {
      throw new Error('A user with this nickname is already registered');
    }

    if (!validator.isEmail(email.trim()) || await User.findOne({ email: email.trim() })) {
      throw new Error('Invalid Email');
    }

    if (password.length < 6 || password > 100) {
      throw new Error('Password have length between 6 and 100 characters');
    }

    const user = new User(req.body);
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
