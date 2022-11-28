/**
 * Copyright (c) 2019-present, Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const OBNIZ_ID = '6119-5084'
const TOIO_SERVICE_UUID = '10b20100-5b3b-4571-9508-cf3efcd7bbae'
const MOTOR_CHARACTERISTIC_UUID = '10b20102-5b3b-4571-9508-cf3efcd7bbae'
const motorBuf = new Uint8Array([0x02, 0x01, 0x01, 0x32, 0x02, 0x02, 0x32, 0x78])

function connect() {
  const obniz = new Obniz(OBNIZ_ID)
  obniz.resetOnDisconnect(false)
  obniz.onconnect = async function() {
    let addressList = []
    const target = {
      localNamePrefix: 'toio',
    }
    await obniz.ble.initWait()
    const Toio_CoreCube = Obniz.getPartsClass('toio_CoreCube')
    obniz.ble.scan.onfind = async function(peripheral) {
      if (Toio_CoreCube.isDevice(peripheral)) {
        addressList.push(peripheral.address)
        if (addressList.length === 2) {
          await obniz.ble.scan.endWait()
          console.log(addressList)
          for (const [index, address] of addressList.entries()) {
            try {
              await obniz.ble.directConnectWait(address, 'random')
              console.log('connected', address)
              $('#status').text(`connected ${address}`)
              if (index === 1) {
                $('#status').text('connected done!')
              }
            } catch (e) {
              console.log("can't connect")
              $('#status').text("can't connect")
            }
          }
        }
      }
    }

    obniz.ble.scan.onfinish = async function(peripherals, error) {
      console.log('scan finished!')
      $('#status').text('scan finished!')
    }

    await obniz.ble.scan.startWait(target)

    $('#move-toio').click(async function() {
      console.log('move toio')
      $('#status').text('move toio')
      const peripheralList = obniz.ble.getConnectedPeripherals()
      if (peripheralList.length > 0) {
        for (const peripheral of peripheralList) {
          await peripheral
            .getService(TOIO_SERVICE_UUID)
            .getCharacteristic(MOTOR_CHARACTERISTIC_UUID)
            .writeWait(motorBuf)
        }
      }
    })
  }
}
