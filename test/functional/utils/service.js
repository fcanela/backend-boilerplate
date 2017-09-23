'use strict';

const Seda = require('seda').Seda;
const Transport = require('seda-amqp-transport').Transport;

function getConnectionURI() {
  const credentials = {
    user: process.env.AMQP_USER,
    password: process.env.AMQP_PASSWORD,
    host: process.env.AMQP_HOST
  };

  const uri = `amqp://${credentials.user}:${credentials.password}@${credentials.host}/`;

  return uri;
}

const uri = getConnectionURI();

exports.getService = async function getService() {
  const seda = new Seda();
  const transport = new Transport(uri);
  seda.setTransport(transport);

  let service;
  await seda.addService({
    name: 'integration_tests',
    start: async function (serv) {
      service = serv;
    }
  });

  await seda.start();

  return service;
};
