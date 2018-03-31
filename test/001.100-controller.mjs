'use strict';


import section from 'section-tests';
import {SpecReporter} from 'section-tests';
import assert from 'assert';
import Server from '../src/Server.mjs';
import Controller from '../src/lib/Controller.mjs';
import request from 'request-promise';
import log from 'ee-log';




section('Controller', (section) => {
    section.test('Instantiate a Controller', async () => {
        new Controller({
            name: 'test',
            service: 'test',
        });
    });



    section.test('Register a controller on the server', async () => {
        const server = new Server({
            port: 8009
        });

        const controller = new Controller({
            name: 'test',
            service: 'test',
        });

        await server.use(controller);
    });



    section.test('Enable a method on a controller', async () => {
        const server = new Server({
            port: 8009
        });


        const MyController = class extends Controller {
            constructor() {
                super({
                    name: 'test',
                    service: 'infect',
                });

                this.enableMethod('create');
            }

            async create(request, response) {
                return {winning: true};
            }
        }

        const controller = new MyController();

        await server.use(controller);
        await server.listen();

        const data = await request.post(`http://l.dns.porn:8009/infect.test`, {
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            }
        }).catch((err) => {
            if (err.name === 'StatusCodeError' && err.statusCode === 303) return;
            else throw err;
        });

        server.end();
    });
});