'use strict';

module.exports = class Config {

    /**
     * @param {string} name
     * @param {*} [defaultValue=null] If default value is missing or null, the value is considered
     *  as mandatory for the app and an exception will be thrown in case the variable is missing
     * @returns {*}
     */
    get (name, defaultValue = null) {

        let value = process.env[name] || defaultValue;

        if (value === null) {
            throw new Error(`Missing mandatory environment variable ${name}.`);
        }

        return value;
    }

    /**
     * @returns {boolean}
     */
    isProductionLike () {
        return ['production', 'test'].includes(process.env.NODE_ENV);
    }

    /**
     * @returns {boolean}
     */
    isProduction () {
        return process.env.NODE_ENV === 'production';
    }

    /**
     * @returns {boolean}
     */
    isTesting () {
        return process.env.NODE_ENV === 'testing';
    }

};
