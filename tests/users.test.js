/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Mohammed',
  nickname: 'moha.khamis',
  age: 20,
  email: 'moha.test@testing.com',
  password: 'testing',
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test('Should success signing up a user', async () => {
  const response = await request(app).post('/users/signup')
    .send({
      name: 'Mohammed Farid Khamis',
      nickname: 'mohaa',
      email: 'dev.moha@gmail.com',
      password: 'hahahahahahahaha!',
      age: 20,
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
});

test('Should fail signing up a user because of name', async () => {
  const id = new mongoose.Types.ObjectId();
  await request(app).post('/users/signup')
    .send({
      _id: id,
      name: '',
      nickname: '',
      age: 20,
      email: 'moha.test@testing.com',
      password: 'testing',
    })
    .expect(400);

  const user = await User.findById(id);
  expect(user).toBeNull();
});

test('Should fail signing up a user because of nickname', async () => {
  const id = new mongoose.Types.ObjectId();
  await request(app).post('/users/signup')
    .send({
      _id: id,
      name: 'Mohammed',
      nickname: 'moha..farid',
      age: 20,
      email: 'moha.test@testing.com',
      password: 'testing',
    })
    .expect(400);

  const user = await User.findById(id);
  expect(user).toBeNull();
});

test('Should fail signing up a user because of age', async () => {
  const id = new mongoose.Types.ObjectId();
  await request(app).post('/users/signup')
    .send({
      _id: id,
      name: 'Mohammed',
      nickname: 'moha.farid',
      age: 12,
      email: 'moha.test@testing.com',
      password: 'testing',
    })
    .expect(400);

  const user = await User.findById(id);
  expect(user).toBeNull();
});

test('Should fail signing up a user because of email', async () => {
  const id = new mongoose.Types.ObjectId();
  await request(app).post('/users/signup')
    .send({
      _id: id,
      name: 'Mohammed',
      nickname: 'moha.farid',
      age: 20,
      email: 'this is not an email',
      password: 'testing',
    })
    .expect(400);

  const user = await User.findById(id);
  expect(user).toBeNull();
});

test('Should fail signing up a user because of password', async () => {
  const id = new mongoose.Types.ObjectId();
  await request(app).post('/users/signup')
    .send({
      _id: id,
      name: 'Mohammed',
      nickname: 'moha.farid',
      age: 20,
      email: 'moha.test@testing.com',
      password: 'short',
    })
    .expect(400);

  const user = await User.findById(id);
  expect(user).toBeNull();
});

test('Should login using email', async () => {
  await request(app).post('/users/signin')
    .send({
      input: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test('Should login using nickname', async () => {
  await request(app).post('/users/signin')
    .send({
      input: userOne.nickname,
      password: userOne.password,
    })
    .expect(200);
});
