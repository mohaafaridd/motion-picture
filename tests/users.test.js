/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

test('Should success signing up a user', async () => {
  await request(app).post('/users/signup')
    .expect(201);
});
