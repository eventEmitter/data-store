'use strict';


import Controller from './Controller';
import assert from 'assert';


export default class RelatedController extends Controller {


    constructor({
        name,
        service,
        db,
    }) {
        super({
            name,
            service,
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

    }
}