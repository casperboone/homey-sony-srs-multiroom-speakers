'use strict'

const Speaker = require('./speaker')

const SOURCE_ALIASES = {
    'exInput:hdmi': 'extInput:hdmi',
    'extInput:line': 'extInput:line?port=1'
}

class AvContent extends Speaker {
    constructor(scalarWebApiEndpoint, callback) {
        super(scalarWebApiEndpoint + '/avContent', callback)
    }
    
    schemes() {
        return new Promise((resolve, reject) => {
            this._send('{"method":"getSchemeList","version":"1.0","params":[],"id":' + ++this.messageId + '}')

            this.waitForMessage(this.messageId)
                .then(message => resolve(message.result[0].map(item => item.scheme)))
                .catch(reject)
        })
    }

    sources() {
        return new Promise((resolve, reject) => {
            let results = []

            this.schemes()
                .then(schemes => {
                    let schemesSet = new Set(schemes)

                    schemes.forEach(scheme => {
                        this._send('{ "method":"getSourceList","params":[{"scheme":"' + scheme + '"}],"version":"1.2","id":' + ++this.messageId + ' }')

                        this.waitForMessage(this.messageId)
                            .then(message => {
                                results = results.concat(message.result[0].map(item => ({
                                    source: SOURCE_ALIASES.hasOwnProperty(item.source) ? SOURCE_ALIASES[item.source] : item.source,
                                    name: item.title
                                })))

                                schemesSet.delete(scheme)

                                if (schemesSet.size == 0) {
                                    resolve(results)
                                }
                            })
                            .catch(reject)
                    })

                })
                .catch(reject)
        })

    }

    setSource(source) {
        this._send(' { "method":"setPlayContent","params":[{"uri":"' + source + '","output":""}],"version":"1.2","id":8 }')
    }

}

module.exports = AvContent
