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

const listOneId = new mongoose.Types.ObjectId();
const listOne = {
  _id: listOneId,
  name: 'list one',
  public: true,
};

const listTwoId = new mongoose.Types.ObjectId();
const listTwo = {
  _id: listTwoId,
  name: 'list two',
  public: true,
  owner: userOneId,
};

const listThreeId = new mongoose.Types.ObjectId();
const listThree = {
  _id: listThreeId,
  name: 'list three',
  public: false,
  owner: userOneId,
};

const listFourId = new mongoose.Types.ObjectId();
const listFour = {
  _id: listFourId,
  name: 'list four',
  public: false,
  owner: userTwoId,
};

const mediaOneId = new mongoose.Types.ObjectId();
const mediaOne = {
  _id: mediaOneId,
  type: 'movie',
  title: 'Life and Death',
  overview: 'things may go wrong',
  poster: 'xd.jpg',
};

const setupDatabase = async () => {
  await List.counterReset('id', () => { });
  await User.deleteMany();
  await Media.deleteMany();
  await List.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new List(listTwo).save();
  await new List(listThree).save();
  await new List(listFour).save();
};

module.exports = {
  setupDatabase,
  userOneId,
  userOne,

  userTwoId,
  userTwo,

  listOneId,
  listOne,

  listTwoId,
  listTwo,

  listThreeId,
  listThree,

  mediaOneId,
  mediaOne,
};
