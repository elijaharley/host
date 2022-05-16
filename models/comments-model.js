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
