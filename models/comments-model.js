const db = require('../db/connection');

exports.fetchCommentsById = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      return rows;
    });
};

exports.addComment = (article_id, comment) => {
  const { body, votes, author } = comment;
  return db
    .query(
      `INSERT INTO comments (body, votes, author, article_id) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [body, votes, author, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Route not found' });
      }
      return rows[0];
    });
};
