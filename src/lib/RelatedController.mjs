'use strict';


import Controller from './Controller';
import assert from 'assert';
import type from 'ee-types';


export default class RelatedController extends Controller {


    constructor({
        name,
        service,
        db,
        primaryId,
    }) {
        super({
            name,
            service,
            primaryId,
        });

        assert(db, `missing the option 'db'!`);
        assert(db[name], `The entity '${name}' is not available on the db!`)

        this.db = db;
        this.entity = this.db[this.name];
    }




    /**
    * create one new row in the db
    */
    async create(request, response) {
        return (await (new this.entity(request.body).save())).toJSON();
    }




    /**
    * update one row in the db
    */
    async update(request, response) {
        if (request.params && type.string(request.params.id) && request.params.id.length) {
            const filter = {};
            filter[this.primaryId] = request.params.id;

            const records = await this.entity('*', filter).find();

            if (records.length === 0) throw new Error(`Cannot update '${this.name}', record with id '${request.params.id}' not found!`);
            else if (records.length > 1) throw new Error(`Cannot update '${this.name}', scan with id '${request.params.id}' returned ${records.length} results which is invalid!`);
            else {
                const record = records[0];
                record.setValues(request.body);
                await record.save();

                return record.toJSON();
            }
        } else throw new Error(`Cannot update '${this.name}', missing ${id}!`);
    }




    /**
    * list one or more rows from the db
    */
    async list(request, response) {
        if (request.params && type.string(request.params.id) && request.params.id.length) {
            const filter = {};
            filter[this.primaryId] = request.params.id;

            const records = await this.entity('*', filter).find();

            if (records.length === 0) {
                response.status(404);
                response.send(`Record with id '${request.params.id}' not found!`);
            } else if (records.length === 1) {
                return records[0].toJSON();
            } else throw new Error(`Scan with id '${request.params.id}' returned ${records.length} results which is invalid!`);
        } else throw new Error(`Cannot update '${this.name}', missing ${id}!`);
    }
}