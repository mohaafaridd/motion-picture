/* eslint-disable no-undef */

const request = require('supertest');
const app = require('../app');

test('Should find match', async () => {
  await request(app).get('/media/search')
    .query({ type: 'movie', title: 'avengers' })
    .expect(200);
});

test('Should not find a match', async () => {
  // passed movies as parameter instead of singular movie
  await request(app).get('/media/search')
    .query({ type: 'movies', title: 'avengers' })
    .expect(400);

  // messed up title
  await request(app).get('/media/search')
    .query({ type: 'movie', title: 'ajsdjasipdjhaisdhaiosd' })
    .expect(400);

  // no given title
  await request(app).get('/media/search')
    .query({ type: 'movie' })
    .expect(400);

  // messed up title
  await request(app).get('/media/search')
    .query({ title: 'avengers' })
    .expect(400);
});

test('Should find media', async () => {
  // Valid movie id
  await request(app).get('/media/movie/299534')
    .expect(200);

  // Valid tv show id
  await request(app).get('/media/tv/1668')
    .expect(200);
});

test('Should not find media', async () => {
  // invalid movie id
  await request(app).get('/media/movie/15234897452341565123')
    .expect(404);

  // invalid movie id
  await request(app).get('/media/tv/54531894752132108945621')
    .expect(404);
});
