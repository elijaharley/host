const { fetchCommentsById, addComment } = require('../models/comments-model');

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  addComment(article_id, comment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
