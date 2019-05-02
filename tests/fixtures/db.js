const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Media = require('../../models/media');
const List = require('../../models/list');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Mohammed',
  nickname: 'moha.khamis',
  age: 20,
  email: 'moha.test@testing.com',
  password: 'testing',
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
  }],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'Sherif',
  nickname: 'sherif.ashraf',
  age: 22,
  email: 'sherif.test@testing.com',
  password: 'testing',
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
  }],
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Media.deleteMany();
  await List.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
};

module.exports = {
  setupDatabase,
  userOneId,
  userOne,
  userTwoId,
  userTwo,
};
