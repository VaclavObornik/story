'use strict';

module.exports = class Monitoring {

    constructor (db) {

        this._providers = [];

        // TODO is there way to not store this in the DB?
        // some mechanism to request each dyno/instance for its statistics?

        this._collection = db.collection('_monitoring'); // to push statistics from all processes
        // todo register resolver for metrics stored in the database
        // todo
    }

    getHttpMiddleware () {
        return async (ctx, next) => {
            await next();
            // todo get and store the response status code
        };
    }

    calculateAllMetrics () {
        // TODO call all _providers
    }

    addMetricProvider (provider) {
        this._providers.push(provider);
    }

};


