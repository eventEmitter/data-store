'use strict';

import type from 'ee-types';
import assert from 'assert';
import log from 'ee-log'; 




export default class Controller {

    constructor({
        name,
        service,
    } = {}) {
        assert(name, `Missing option 'name'!`);
        assert(name, `Missing option 'service'!`);
        this.name = name;
        this.service = service;

        this.enabledMethods = new Set();
        this.methodConfig = new Map([
            ['create', {
                method: 'post',
                status: 201,
                redirect: 'id',
                type: 'application/json',
                writing: true,
            }],
            ['update',  {
                method: 'patch',
                status: 200,
                type: 'application/json',
                writing: true,
            }],
            ['createOrUpdate',  {
                method: 'put',
                status: 200,
                type: 'application/json',
                writing: true,
            }],
            ['delete', {
                method: 'delete',
                status: 200,
                type: 'application/json',
                writing: true,
            }],
            ['list',  {
                method: 'get',
                status: 200,
                type: 'application/json',
            }],
            ['describe',  {
                method: 'options',
                status: 200,
                type: 'application/json',
                writing: true,
            }],
        ]);
    }






    /**
    * enable a specific method for this controller
    */
    enableMethod(methodName) {
        if (this.methodConfig.has(methodName)) {
            if (type.function(this[methodName])) {
                this.enabledMethods.add(methodName);
            } else throw new Error(`The method '${methodName}' is not available on the controller '${this.name}'`);
        } else if (methodName === '*') {

            // register all methods that are available
            for (const method of this.methodConfig.keys()) {
                if (type.function(this[method])) {
                    this.enabledMethods.add(method);
                }
            }
        } else throw new Error(`Cannot enable action '${methodName}'. Only the the actions '${Array.from(this.methodConfig.keys()).join(`', '`)}' asre allowed!`);
    }







    /**
    * register routes, prepare the controller
    */
    async load(app) {
        for (const methodName of this.enabledMethods.values()) {
            if (type.function(this[methodName])) {
                const config = this.methodConfig.get(methodName);

                app[config.method](`/${this.service}.${this.name}/:id?`, (request, response) => {
                    if (request.accepts(config.type) && (!config.writing || request.headers['content-type'] && request.headers['content-type'].trim().toLowerCase() === config.type)) {

                        // hijack some methods in order to be able 
                        // to get the sent status correctly
                        const send = response.send;
                        const end = response.end;
                        let isSent = false;

                        response.send = (...params) => {
                            isSent = true;
                            return send.apply(response, params);
                        }

                        response.end = (...params) => {
                            isSent = true;
                            return end.apply(response, params);
                        }


                        this[methodName](request, response).then((data) => {
                            if (isSent) return;

                            if (config.redirect) {
                                response.status(303);
                                response.append('location', `/${this.service}.${this.name}/${data[config.redirect]}`);
                                response.end();
                            } else {
                                if (type.object(data)) data = JSON.stringify(data);
                                response.append('content-type', config.type);
                                response.status(config.status);
                                response.send(data);
                            }
                        }).catch((err) => {
                            if (!isSent) { 
                                response.status(500);
                                response.send(err.message);
                            }

                            log(err);
                        });
                    } else {
                        response.status(406).send(`Only accepting and returning type '${config.type}'!`);
                    }
                });
            } else throw new Error(`Cannot enable method '${methodName}' on controller '${this.name}', the class has no method '${methodName}'!`);
        }
    }
}