/* eslint-disable no-underscore-dangle */
const User = require('../models/user');
const listsHelpers = require('../controllers/helpers/listsHelpers');

// Sign up page
const getSignupPage = async (req, res) => {
  res.render('user/signup', { user: req.user });
};

// Sign up
const postSignup = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.cookie('auth', token, { maxAge: process.env.EXP_DATE });

    res.status(201).redirect('/');
  } catch (error) {
    res.status(400).redirect('/users/signup');
  }
};

// Sign up page
const getSigninPage = async (req, res) => {
  res.render('user/signin', { user: req.user });
};

// Sign in
const postSignin = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body);
    const token = await user.generateAuthToken();
    res.cookie('auth', token, { maxAge: process.env.EXP_DATE });
    res.status(200).redirect('/');
  } catch (error) {
    res.status(400).redirect('/user/signin');
  }
};

// Sign out
const postSignout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens
      .filter(token => token.token !== req.token);
    res.clearCookie('auth');
    await req.user.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send();
  }
};

const getUser = async (req, res) => {
  const { nickname } = req.params;
  const { user } = req;
  const profile = await User.findOne({ nickname });

  const lists = await listsHelpers.getListJSON(req, 'params');
  const isOwner = user._id.toString() === profile._id.toString();
  res.render('user/profile', {
    profile,
    user,
    lists,
    isLogged: !user.isAnonymous,
    isOwner,
  });
};

module.exports = {
  getSignupPage,
  postSignup,
  postSignin,
  postSignout,
  getSigninPage,
  getUser,
};
