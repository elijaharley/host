const {
  fetchCommentsById,
  addComment,
  removeComment
} = require('../models/comments-model');
const { checkExists } = require('../models/utils.model');

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [checkExists(article_id)];
  if (article_id) {
    promises.push(fetchCommentsById(article_id));
  }
  Promise.all(promises)
    .then(([_, comments]) => {
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

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send({ msg: `${comment_id} deleted` });
    })
    .catch(next);
};
