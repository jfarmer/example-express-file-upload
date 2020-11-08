let process = require('process');

let Knex = require('knex');
let dbConfig = require('./knexfile');

if (process.env.NODE_ENV === undefined) {
  console.error('NODE_ENV environment variabled undefined');
  process.exit(1);
}

module.exports = Knex(dbConfig[process.env.NODE_ENV]);
