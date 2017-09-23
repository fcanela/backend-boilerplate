'use strict';

const debug = require('debug')('service-models-estate');
const knexPostgis = require('knex-postgis');

const cartographyStandard = 4326;

exports.name = 'estate';
exports.define = function defineModel(db) {
  const estateTable = 'estate';
  const st = knexPostgis(db);

  return {
    create: async function create(properties) {
      debug('Creating estate ' + properties);

      const { latitude, longitude } = properties;
      if (latitude && longitude) {
        properties.location = st.geomFromText(`Point(${longitude} ${latitude})`, cartographyStandard);
      }

      const fields = ['id', 'userId', 'type', 'operation', 'isListed', 'price', 'street', 'number', 'postalCode', 'latitude', 'longitude'];
      const results = await db(estateTable)
        .insert(properties)
        .returning(fields);

      const estate = results[0];

      return [null, estate];
    },

    findByUserId: async function findByUserId(userId) {
      debug('Finding estates owned by user with id ' + userId);
      const estates = await db(estateTable).where({
        userId
      }).select();

      const result = estates.length > 0 ? estates : null;

      return [null, result];
    },

    findById: async function findById(id) {
      debug('Finding estate with id ' + id);
      const estates = await db(estateTable).where({
        id
      }).select();

      const result = estates.length > 0 ? estates[0] : null;

      return [null, result];
    },

    findWithinRadius: async function findWithinRadius(lat, lon, distance, searchProperties) {
      //const query = 'ST_Within(estate.location, ST_Transform(ST_Buffer(ST_Transform(ST_SetSRID(ST_MakePoint(?, ?), 4326), 3857), ?), 4326))';
      const query = `st_distance(estate.location, st_geomfromtext('POINT(${lon} ${lat})', 4326), true) < ${distance}`;
      console.log(await db(estateTable)
        .whereRaw(query)
        .select().toString());
      const estates = await db(estateTable)
        .whereRaw(query)
        .select();

      console.log(estates);

      return [null, estates];
    }
  };

};
