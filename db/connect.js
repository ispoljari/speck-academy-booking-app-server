const { Pool } = require("pg");

const { DB_CONNECTION } = require("../config");

const pool = new Pool(DB_CONNECTION);

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
};
