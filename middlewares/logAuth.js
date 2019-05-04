/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const anonymous = require('../controllers/anonymous');

const auth = async (req, res, next) => {
  try {
    // const token = req.header('Authorization').replace('Bearer ', '');
    const token = req.cookies.auth;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    res.redirect('/');
  } catch (error) {
    req.user = anonymous();
    next();
  }
};

module.exports = auth;
