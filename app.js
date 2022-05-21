const express = require('express');
const { getTopics } = require('./controllers/topics-controller');
const {
  getArticleById,
  patchArticleById,
  getArticles
} = require('./controllers/articles-controller');
const { getUsers } = require('./controllers/users-controllers');
const {
  getCommentsById,
  postComment,
  deleteComment
} = require('./controllers/comments-controller');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);
app.get('/api/users', getUsers);
app.get('/api/articles/:article_id/comments', getCommentsById);
app.post('/api/articles/:article_id/comments', postComment);
app.delete('/api/comments/:comment_id/', deleteComment);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  }
  if (err.code === '23502') {
    res.status(400).send({ msg: 'Bad request' });
  }
  if (err.code === '23503') {
    res.status(404).send({ msg: 'Route not found' });
  }
  if (err.code === '42P01') {
    res.status(404).send({ msg: 'Route not found' });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;
