'use strict';

exports.up = async function(db) {
  await db.raw('CREATE EXTENSION IF NOT EXISTS postgis');
  await db.raw('CREATE EXTENSION IF NOT EXISTS postgis_topology');
};

exports.down = async function() {
};
