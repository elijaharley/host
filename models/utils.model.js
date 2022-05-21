// const format = require('pg-format');
const db = require('../db/connection');

//can also add queries
exports.checkExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Route not found`
        });
      }
    });
};
