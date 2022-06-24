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

  it('400: returns correct error when passed an invalid endpoint', () => {
    return request(app)
      .get('/api/articles/notAnId')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  it('404: returns correct error when passed a non-existant endpoint', () => {
    return request(app)
      .get('/api/articles/9999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
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
  it('400: returns correct error when passed an invalid endpoint', () => {
    return request(app)
      .patch('/api/articles/notAnId')
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  it('404: returns correct error when passed a non-existant endpoint', () => {
    return request(app)
      .patch('/api/articles/9999')
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });

  it('400: returns correct error when passed an invalid request body', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
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
              comments_count: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number)
            })
          );
        });
      });
  });
});

//add tests for ticket 16

// - [ ] Status 200, array of article objects (including `comment_count`, excluding `body`)
// - [ ] Status 200, default sort & order: `created_at`, `desc`
// - [ ] Status 200, accepts `sort_by` query, e.g. `?sort_by=votes`
// - [ ] Status 200, accepts `order` query, e.g. `?order=desc`
// - [ ] Status 200, accepts `topic` query, e.g. `?topic=coding`
// - [ ] Status 400. invalid `sort_by` query, e.g. `?sort_by=bananas`
// - [ ] Status 400. invalid `order` query, e.g. `?order=bananas`
// - [ ] Status 404. non-existent `topic` query, e.g. `?topic=bananas`
// - [ ] Status 200. valid `topic` query, but has no articles responds with an empty array of articles, e.g. `?topic=paper`

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

  it('200: returns empty array for selected article with no comments', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
        expect(comments).toEqual([]);
      });
  });

  //should also work for valid article with no comments as []

  it('400: returns correct error when passed an invalid endpoint', () => {
    return request(app)
      .get('/api/articles/notAnId/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  it('404: returns correct error when passed a non-existant endpoint', () => {
    return request(app)
      .get('/api/articles/9999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });
});

describe('POST /api/articles/:article/comments', () => {
  const newComment = {
    body: 'I liked it a lot',
    votes: 0,
    author: 'butter_bridge'
  };
  it('201: returns comments for selected article', () => {
    return request(app)
      .post('/api/articles/9/comments')
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
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
  it('400: returns correct error when passed an invalid endpoint', () => {
    return request(app)
      .post('/api/articles/notAnId/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  it('404: returns correct error when passed a non-existant endpoint', () => {
    return request(app)
      .post('/api/articles/9999/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Route not found');
      });
  });

  it('400: returns correct error when passed an invalid request body', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});

describe('DELETE /api/articles/:article_id/comments', () => {
  it('204: returns empty body and status code - deleted', () => {
    return request(app).delete(`/api/comments/1`).expect(204);
  });
  it('400: returns empty body and status code - deleted', () => {
    return request(app).delete(`/api/comments/notAnId`).expect(400);
  });
  it('404: returns empty body and status code - deleted', () => {
    return request(app).delete(`/api/comments/9999`).expect(404);
  });
});
