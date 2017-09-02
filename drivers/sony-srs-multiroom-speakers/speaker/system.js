'use strict'

const Speaker = require('./speaker');

class System extends Speaker {
    constructor(scalarWebApiEndpoint, callback) {
        super(scalarWebApiEndpoint + '/system', callback)
    }
}

module.exports = System
