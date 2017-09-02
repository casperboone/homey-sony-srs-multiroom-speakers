'use strict'

const Homey = require('homey')
const Discoverer = require('./discoverer')

class MyDriver extends Homey.Driver {

    onPairListDevices(data, callback) {
        Discoverer.discover()
            .then(results => callback(null, results.map(speaker => ({ name: speaker.name, data: speaker }))))
            .catch(error => callback(error))
    }

}

module.exports = MyDriver