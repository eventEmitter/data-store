'use strict';

const log = require('ee-log');
const envr = require('envr');


module.exports = {
   database: {
        type: 'postgres',
        database: 'test',
        schema: 'data_store',
        hosts: [{
            host: '10.80.100.1',
            username: 'postgres',
            password: envr.get('dbPass'),
            port: 5432,
            pools: ['read', 'write'],
            maxConnections: 20,
        }]
    },
}