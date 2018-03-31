'use strict';


import express from 'express';
import bodyParser from 'body-parser';
import log from 'ee-log';



export default class Server {


    constructor({
        port,
    } = {}) {
        this.app = express();

        const portConfig = process.argv.find(item => item.startsWith('--port='));
        this.port = portConfig ? parseInt(portConfig.substr(7), 10) : port;

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true,
        }));

        this.enableCORS();
    }



    enableCORS() {
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            res.header("Access-Control-Allow-Methods", "*");
            next();
        });

    }



    end() {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) reject(err);
                else resolve(this.port);
            });
        });
    }



    /**
    * load a controller, let it register its routes
    * on our server
    */
    async use(controller) {
        await controller.load(this.app);
    }




    listen() {
        return new Promise((resolve, reject) => {
            if (!this.port) throw new Error(`No port defined!`);

            this.server = this.app.listen(this.port, (err) => {
                if (err) reject(err);
                else resolve(this.port);
            });
        });
    }



    getApp() {
        return this.app;
    }
}