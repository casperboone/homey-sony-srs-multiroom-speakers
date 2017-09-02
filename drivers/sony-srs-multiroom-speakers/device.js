'use strict'

const Homey = require('homey')
const Audio = require('./speaker/audio')
const AvContent = require('./speaker/av-content')

class SonySrsMultiroomSpeaker extends Homey.Device {
    onInit() {
        this.audio = new Audio(this.getData().scalarWebApiBaseUrl)
        this.avContent = new AvContent(this.getData().scalarWebApiBaseUrl)

        this.registerCapabilityListener('volume_set', this.onVolumeSet.bind(this))

        new Homey.FlowCardAction('volume_set').register().registerRunListener((args, state) => {
            this.audio.setVolume(args.volume)

            return Promise.resolve(true)
        })

        new Homey.FlowCardAction('source_set').register()
            .registerRunListener((args, state) => {
                this.avContent.setSource(args.source.source)

                return Promise.resolve(true)
            })
            .getArgument('source')
            .registerAutocompleteListener((query, args) => {
                return this.avContent.sources()
            })
    }

    onVolumeSet(value, opts, callback) {
        console.log(value)
        console.log(opts)

        return Promise.reject(new Error('Not implemented'))
    }
}

module.exports = SonySrsMultiroomSpeaker
