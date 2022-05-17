const db = require('../db/connection');

exports.fetchArticleById = (article_id) => {
  const queryStr = `SELECT articles.*, CAST(COUNT (comments.article_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE comments.article_id = $1 GROUP BY articles.article_id`;

  const queryParams = [article_id];

  return db.query(`${queryStr};`, queryParams).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Route not found' });
    } else {
      return rows[0];
    }
  });
};

exports.updateArticleById = (votes, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Route not found' });
      }
      return rows[0];
    });
};

exports.fetchArticles = () => {
  //const greenlist = [article_id, title, topic, author];
  return db.query(`SELECT * FROM articles;`).then(({ rows }) => {
    return rows;
  });
};
