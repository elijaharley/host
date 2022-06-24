const db = require('../db/connection');

exports.fetchArticleById = (article_id) => {
  const queryStr = `SELECT articles.*, CAST(COUNT (comments.article_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE comments.article_id = $1 GROUP BY articles.article_id;`;

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

//without queries
// exports.fetchArticles = () => {
//   return db.query(`SELECT * FROM articles;`).then(({ rows }) => {
//     return rows;
//   });
// };

//with queries
exports.fetchArticles = (sort_by = 'created_at', order = 'desc', topic) => {
  const greenListSortBy = [
    'created_at',
    'title',
    'topic',
    'author',
    'votes',
    'article_id'
  ];
  const greenListOrderBy = ['asc', 'desc'];

  if (!greenListSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }
  if (!greenListOrderBy.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, COUNT(comments.article_id) AS comments_count FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  `;

  const queryValues = [];
  if (topic) {
    queryStr += `WHERE topic = $1 `;
    queryValues.push(topic);
  }
  queryStr += `GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order}`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Topic not found' });
    }
    return rows;
  });
};
