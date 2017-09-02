'use strict'

const Speaker = require('./speaker');

class Guide extends Speaker {
    constructor(scalarWebApiEndpoint, callback) {
        super(scalarWebApiEndpoint + '/guide', callback)
    }
}

module.exports = Guide
