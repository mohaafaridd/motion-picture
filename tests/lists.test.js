/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

const {
  userOne,
  userTwo,
  listOneId,
  listOne,
  mediaOne,
  setupDatabase,
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create a list', async () => {
  // Cretes a list for userOne
  await request(app).post('/lists')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send(listOne)
    .expect(201);
});

test('Should not create a list for unauthenticated users', async () => {
  // Fail to pass token to the app
  await request(app).post('/lists')
    .send(listOne)
    .expect(401);
});

test('Should add media to a list', async () => {
  await request(app).post('/media/add-to-list')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      ...mediaOne,
      owner: listOneId,
    })
    .expect(200);
});

test('Should not add media to list', async () => {
  await request(app).post('/media/add-to-list')
    .send({
      ...mediaOne,
      owner: listOneId,
    })
    .expect(401);

  await request(app).post('/media/add-to-list')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      ...mediaOne,
    })
    .expect(400);
});

test('Should get a specific list', async () => {
  await request(app).get(`/users/${userOne.nickname}/lists/1`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get a specific list', async () => {
  await request(app).get(`/users/${userOne.nickname}/lists/5`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
});

test('Should get a private list', async () => {
  await request(app).get(`/users/${userOne.nickname}/lists/2`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get a private list when not authenticated', async () => {
  await request(app).get(`/users/${userOne.nickname}/lists/2`)
    .send()
    .expect(404);
});

test('Sould get all lists', async () => {
  const lists = await request(app).get(`/users/${userOne.nickname}/lists`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(lists.body).toHaveLength(2);
});

test('Sould not get any lists', async () => {
  const lists = await request(app).get(`/users/${userTwo.nickname}/lists`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(lists.body).toHaveLength(0);
});
