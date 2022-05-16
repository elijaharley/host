const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const db = require('../db/connection');
const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe('GET /api/topics', () => {
  it('200: returns all topics ', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String)
            })
          );
        });
      });
  });
  it('404: returns correct error when passed an invalid endpoint', () => {
    return request(app)
      .get('/api/toppings')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  it('200: returns the requested article', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          comment_count: 11
        });
      });
  });

  it('404: returns correct error when passed an invalid endpoint', () => {
    return request(app)
      .get('/api/articles/notAnId')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });
  it('400: returns correct error when passed a non-existant endpoint', () => {
    return request(app)
      .get('/api/articles/9999')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  it('200: returns the updated article', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 101
        });
      });
  });
  it('200: returns the updated article', () => {
    return request(app)
      .patch('/api/articles/3')
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 3,
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: '2020-11-03T09:12:00.000Z',
          votes: -5
        });
      });
  });
  it('404: returns correct error when passed an invalid endpoint', () => {
    return request(app)
      .patch('/api/articles/notAnId')
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });
  it('400: returns correct error when passed a non-existant endpoint', () => {
    return request(app)
      .patch('/api/articles/9999')
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });

  it('400: returns correct error when passed an invalid request body', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });
});

describe('GET /api/users', () => {
  it('200: returns an array of users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            })
          );
        });
      });
  });
});
describe('GET /api/articles', () => {
  it('200: returns all articles', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number)
            })
          );
        });
      });
  });
});

//'/api/articles?sort_by=article_id'
//expect(article).toBeSortedBy(article_id);

describe('GET /api/articles/:article_id/comments', () => {
  it('200: returns comments for selected article', () => {
    return request(app)
      .get('/api/articles/9/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String)
            })
          );
        });
      });
  });
  it('404: returns correct error when passed an invalid endpoint', () => {
    return request(app)
      .get('/api/articles/notAnId/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });
  it('400: returns correct error when passed a non-existant endpoint', () => {
    return request(app)
      .get('/api/articles/9999/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});
