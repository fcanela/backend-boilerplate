'use strict';

const tableName = '{{name}}';

const values = [
  {
    field: 'value'
  }
];

exports.up = async function(db) {
  await db.transaction(async function(t) {
    await db.batchInsert(tableName, values).transacting(t);
  });
};

exports.down = async function(db) {
  const promises = [];

  values.map(function(value) {
    const promise = db(tableName).where('field', value.field).del();
    promises.push(promise);
  });

  await Promise.all(promises);
};
