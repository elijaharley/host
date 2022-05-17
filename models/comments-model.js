const db = require('../db/connection');

exports.fetchCommentsById = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: 'Bad request' });
      }
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
