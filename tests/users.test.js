/* eslint-disable no-undef */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany();
});

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Mohammed',
  nickname: 'moha.khamis',
  age: 20,
  email: 'moha.test@testing.com',
  password: 'testing',
};

test('Should success signing up a user', async () => {
  await request(app).post('/users/signup')
    .send(userOne)
    .expect(201);

  const user = await User.findById(userOneId);
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
