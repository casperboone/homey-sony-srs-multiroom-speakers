'use strict'

const Homey = require('homey')
const Audio = require('./speaker/audio')
const AvContent = require('./speaker/av-content')

class SonySrsMultiroomSpeaker extends Homey.Device {
    onInit() {
        this.audio = new Audio(this.getData().scalarWebApiBaseUrl)
        this.avContent = new AvContent(this.getData().scalarWebApiBaseUrl)

        setInterval(() => {
            this.audio.getVolume().then(status => {
                this.setCapabilityValue('volume_set', status.volume / 50)
                this.setCapabilityValue('volume_mute', status.mute === "on")
            })
        }, 5000)

        this.registerCapabilityListener('volume_set', volume => {
            this.audio.setVolume(volume * 50)

            return Promise.resolve(true)
        })

        this.registerCapabilityListener('volume_mute', mute => {
            this.audio.setMute(mute)

            return Promise.resolve(true)
        })

        new Homey.FlowCardAction('volume_set').register().registerRunListener((args, state) => {
            this.audio.setVolume(args.volume * 50)

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
}

module.exports = SonySrsMultiroomSpeaker
