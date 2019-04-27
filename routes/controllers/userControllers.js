
// Sign up
const signup = (req, res) => {
  try {
    res.status(201).send('Registered');
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  signup,
};
