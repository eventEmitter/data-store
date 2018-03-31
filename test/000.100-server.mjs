'use strict';


import section from 'section-tests';
import {SpecReporter} from 'section-tests';
import assert from 'assert';
import Server from '../src/Server.mjs';


section.use(new SpecReporter());



section('Server', (section) => {
    section.test('Instantiate the class', async () => {
        new Server();
    });


    section.test('Listen', async () => {
        const server = new Server({
            port: 8009
        });

        await server.listen();
        await server.end();
    });
});