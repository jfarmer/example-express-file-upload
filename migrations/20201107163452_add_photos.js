exports.up = function(knex) {
  return knex.schema.createTable('photos', (table) => {
    table.increments('id').primary();
    table.text('key').notNullable();
    table.text('filename').notNullable();
    table.text('content_type');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('photos');
};
