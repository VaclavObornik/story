'use strict';

const Server = require('./Server');
const db = require('./db');
const packageJson = require('./packageJson');
const checkVersionOfNode = require('./checkVersionOfNode');

checkVersionOfNode({ packageJson });

module.exports = {

    _server: null,

    _db: null,

    _prometheus: null,

    _config: null,

    _getServer () {
        if (!this._server) {
            this._server = new Server();
        }
        return this._server;
    },

    router (...args) {
        const server = this._getServer();
        return server.rootRouter(...args);
    },

    async initDb () {
        this._db = await db({ config, log, packageJson });
    },

    get db () {
        if (this._db === null) {
            throw new Error('The initDb method has to be called before db usage');
        }
        return this._db;
    },

    get config () {
        if (this._config === null) {

        }
    },

    _getPrometheus () {

    },

    monitor (exporter) { // todo name of metric?
        return this._getPrometheus().addMetricProvider(exporter);
    }

};
