'use strict';


import assert from 'assert';
import dir from './_dirname';
import envr from 'envr';
import log from 'ee-log';
import path from 'path';
import Related from 'related';
import RelatedController from '../src/lib/RelatedController';
import request from 'request-promise';
import section from 'section-tests';
import Server from '../src/Server';
import {SpecReporter} from 'section-tests';



// load environment specific config
const config = envr.config(path.join(dir, '../config'), path.join(dir, '../'));




section('RelatedController', (section) => {
    let server;
    let related;
    let db;


    section.setup('load the database', async () => {
        related = new Related(config.database);
        await related.load();
        db = related.data_store;
    });


    section.setup('load the server', async () => {
        server = new Server({
            port: 8009
        });

        await server.listen();
    });



    section.test('Create', async () => {
        const MyController = class extends RelatedController {
            constructor({
                db,
            }) {
                super({
                    name: 'dataSet',
                    service: 'infect',
                    db,
                });

                this.enableMethod('create');
            }
        }


        const controller = new MyController({db});
        await server.use(controller);


        const data = await request.post(`http://l.dns.porn:8009/infect.dataSet`, {
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            body: {
                identifier: 'test'+Math.random()
            },
            json: true,
        }).catch((err) => {
            if (err.name === 'StatusCodeError' && err.statusCode === 303) return;
            else throw err;
        });
    });



    section.destroy('end the database', async () => {
        await related.end();
    });


    section.destroy('end the server', async () => {
        await server.end();
    });
});