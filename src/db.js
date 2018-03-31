'use strict';

const semver = require('semver');
const mongodb = require('mongodb');
const camelcase = require('lodash.camelcase');

async function checkVersionOfMongo (packageJson, db, config, log) {
    const { mongo: requiredVersionOfMongo } = packageJson.engines || {};
    if (!requiredVersionOfMongo) {
        throw new Error('The file package.json has to contains a required version of Mongo in the "engines.mongo".');
    }

    const { version: currentVersionOfMongo } = await db.admin().serverStatus();
    if (!semver.satisfies(currentVersionOfMongo, requiredVersionOfMongo)) {
        const error = new Error(`The version of the connected MongoDB server (${currentVersionOfMongo}) does not match with required version (${requiredVersionOfMongo})`);
        if (!config.isProduction()) {
            throw error;
        }
        log.error(error);
    }
}

function getConnectionString (config, packageJson) {

    let defaultConnectionString = null; // no default value
    if (!config.isProductionLike()) {
        const databaseName = `${camelcase(packageJson.name)}${config.isTesting() ? 'Testing' : ''}`;
        defaultConnectionString = `mongodb://127.0.0.1:27017/${databaseName}`;
    }

    return config.get('MONGO_URI', defaultConnectionString);
}

/**
 * @param {{ config: Config, log: Log, packageJson: { name: string, engines: { mongo: string } } }} dependencies
 * @returns {Promise.<mongodb.Db>}
 */
module.exports = async ({ config, log, packageJson }) => {

    const connectionString = getConnectionString(config, packageJson);

    const db = await mongodb.connect(connectionString);

    await checkVersionOfMongo(packageJson, db, config, log);

    return db;
};
