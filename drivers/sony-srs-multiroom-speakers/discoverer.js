'use strict'

const SsdpClient = require('node-ssdp').Client
const request = require('request-promise-native')
const xml2js = require('xml2js')

const SSDP_SERVICE_TYPE = 'urn:schemas-sony-com:service:ScalarWebAPI:1'

class Discoverer {
    static discover(timeout = 5000) {
        return new Promise((resolve, reject) => {
            let ssdp = new SsdpClient()
            let discovered = []

            let failed = error => {
                ssdp.stop()
                clearTimeout(timer)
                reject(error)
            }

            let timer = setTimeout(() => {
                ssdp.stop()
                resolve(discovered)
            }, timeout)

            ssdp.on('response', (headers, statusCode, data) => {
                if (! headers.hasOwnProperty('LOCATION')) return

                requestDeviceDetails(headers.LOCATION)
                    .then(details => {
                        discovered.push({
                            uniqueDeviceName: details.uniqueDeviceName,
                            ipAddress: data.address,
                            port: data.port,
                            name: details.name,
                            scalarWebApiBaseUrl: details.scalarWebApiBaseUrl,
                            scalarWebApiAudioEndpoint: details.scalarWebApiAudioEndpoint
                        })
                    })
                    .catch(failed)
            })

            ssdp.search(SSDP_SERVICE_TYPE)
        })
    }
}

function requestDeviceDetails(url) {
    return new Promise((resolve, reject) => {
        console.log(url)
        request("#0 URL:" + url)
            .then(result => {
                console.log("#1 RAW FILE: " + result)
                xml2js.parseString(result, (error, result) => {
                    if (error) {
                        reject(error)
                        return
                    }

                    try {
                        let scalarWebApiBaseUrl = result.root.device[0]['av:X_ScalarWebAPI_DeviceInfo'][0]['av:X_ScalarWebAPI_BaseURL'][0]
                        console.log("#2 Scalar Web API Base URL: " + scalarWebApiBaseUrl)
                        let services = result.root.device[0]['av:X_ScalarWebAPI_DeviceInfo'][0]['av:X_ScalarWebAPI_ServiceList'][0]['av:X_ScalarWebAPI_ServiceType']
                        console.log("#3 Services: " + services)

                        if (! services.includes('audio')) {
                            throw 'Audio service not available on this device'
                        }

                        console.log("#4 Unique Device name: " + result.root.device[0].UDN[0])
                        console.log("#5 Name: " + result.root.device[0].friendlyName[0])
                        resolve({
                            uniqueDeviceName: result.root.device[0].UDN[0],
                            name: result.root.device[0].friendlyName[0],
                            scalarWebApiBaseUrl: scalarWebApiBaseUrl,
                            scalarWebApiAudioEndpoint: scalarWebApiBaseUrl + '/audio',
                        })
                    } catch (error) {
                        reject(error)
                    }
                })

            })
            .catch(reject)
    })
}

module.exports = Discoverer
