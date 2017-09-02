'use strict'

const Speaker = require('./speaker');

class AppControl extends Speaker {
    constructor(scalarWebApiEndpoint, callback) {
        super(scalarWebApiEndpoint + '/appControl', callback)
    }
}

module.exports = AppControl
