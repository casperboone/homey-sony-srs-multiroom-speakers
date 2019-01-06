'use strict'

const Speaker = require('./speaker')

class Audio extends Speaker {
    constructor(scalarWebApiEndpoint, callback) {
        super(scalarWebApiEndpoint + '/audio', callback)
    }

    setVolume(volume) {
        this._send('{ "method":"setAudioVolume","params":[{"volume":"' + volume + '","output":""}],"version":"1.1","id":' + this.newMessageId() +' }')
    }

    setMute(mute) {
        this._send('{ "method":"setAudioMute","params":[{"mute":"' + (mute ? 'on' : 'off') + '","output":""}],"version":"1.1","id":' + this.newMessageId() +' }')
    }

    getVolume() {
        return new Promise((resolve, reject) => {
            this._send('{ "method":"getVolumeInformation","params":[{"output":""}],"version":"1.1","id":' + this.newMessageId() + ' }')

            this.waitForMessage(this.messageId)
                .then(message => resolve(message.result[0][0]))
                .catch(reject)
        })
    }
}

module.exports = Audio
