'use strict'

const WebSocket = require('ws')

class Speaker {
    constructor(scalarWebApiEndpoint) {
        this.scalarWebApiEndpoint = scalarWebApiEndpoint

        this.messageId = 0
        this.messageQueue = new Map()

        this._reconnect()
    }

    waitForMessage(id, timeout = 5000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject("Message not received within " + timeout + " milliseconds"), timeout)

            this.messageQueue.set(id, resolve)
        })
    }

    _send(body) {
        if (this.available) {
            this.ws.send(body)
        }
    }

    _reconnect() {
        this.ws = new WebSocket(this.scalarWebApiEndpoint.replace('http', 'ws'))

        this.ws.on('open', () => {
            console.log('Connection with speaker is active')
            this.available = true
        })

        this.ws.on('close', () => {
            console.log('Connection closed, reconnecting in 5 seconds...')
            this.available = false

            setTimeout(() => this._reconnect(), 5000)
        })

        this.ws.on('message', rawMessage => {
            let message = JSON.parse(rawMessage)

            if (this.messageQueue.has(message.id)) {
                this.messageQueue.get(message.id)(message)
            }
        })
    }
}

module.exports = Speaker
