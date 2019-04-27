const User = require('../models/user');

// Sign up
const signup = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Sign in
const signin = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body);
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
};

// Sign out
const signout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens
      .filter(token => token.token !== req.token);

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  signup,
  signin,
  signout,
};
