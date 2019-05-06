const User = require('../models/user');
const { getPopular } = require('./helpers/indexHelpers');
const listsHelpers = require('./helpers/listsHelpers');

const getHome = async (req, res) => {
  try {
    const { user } = req;
    user.isAnonymous = !!user.isAnonymous;
    const popular = await getPopular(user);
    const lists = user.isAnonymous ? [] : await listsHelpers.getListJSON(req, 'user');
    const hasList = lists.length !== 0;
    res.render('index', {
      title: 'Motion Picture',
      user,
      popular,
      options: lists,
      hasList,
      isLogged: !user.isAnonymous,
    });
  } catch (error) {
    res.redirect(req.header('Referer'));
  }
};

// Registeration page
const getRegister = async (req, res) => {
  res.render('index/register', { user: req.user });
};

const postRegister = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.cookie('auth', token, { maxAge: process.env.EXP_DATE });

    res.status(201).redirect('/');
  } catch (error) {
    res.status(400).redirect(req.header('Referer'));
  }
};

module.exports = {
  getHome,
  getRegister,
  postRegister,
};
