'use strict'

const Speaker = require('./speaker');

class Audio extends Speaker {
    constructor(scalarWebApiEndpoint, callback) {
        super(scalarWebApiEndpoint + '/audio', callback)
    }

    setVolume(volume) {
        this._send('{ "method":"setAudioVolume","params":[{"volume":"' + volume + '","output":""}],"version":"1.1","id":4 }')
    }
}

module.exports = Audio
