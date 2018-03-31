'use strict';

const semver = require('semver');

/**
 * @param {{ packageJson: String, config: RegExp }} aaa
 */
module.exports = ({ packageJson }) => {

    const { node: requiredVersionOfNode } = packageJson.engines || {};
    if (!requiredVersionOfNode) {
        throw new Error('The file package.json has to contains a required version of NodeJS in the "engines.node".');
    }

    const currentVersionOfNode = process.version;
    if (!semver.satisfies(currentVersionOfNode, requiredVersionOfNode)) {
        throw new Error(`The version of the started NodeJS (${currentVersionOfNode}) does not match with required version (${requiredVersionOfNode})`);
    }
};