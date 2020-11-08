let process = require('process');

let Knex = require('knex');
let dbConfig = require('./knexfile');

if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = 'development';
}

module.exports = Knex(dbConfig[process.env.NODE_ENV]);
