const User = require('../../models/user');

// Sign up
const signup = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    res.status(201).send({ user });
  } catch (error) {
    res.status(400).send(error);
  }
};

const signin = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body);
    res.send(user);
  } catch (error) {
    res.status(400).send();
  }
};

module.exports = {
  signup,
  signin,
};
