/**
 * Copyright (c) 2019-present, Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const OBNIZ_ID = '6119-5084'
const TOIO_SERVICE_UUID = '10b20100-5b3b-4571-9508-cf3efcd7bbae'
const MOTOR_CHARACTERISTIC_UUID = '10b20102-5b3b-4571-9508-cf3efcd7bbae'
const SOUND_CHARACTERISTIC_UUID = '10B20104-5B3B-4571-9508-CF3EFCD7BBAE'
const motorBuf1 = new Uint8Array([0x02, 0x01, 0x01, 0x32, 0x02, 0x02, 0x32, 0x78])
const soundBuf1 = new Uint8Array([0x02, 0x04, 0xFF])
const motorBuf2 = new Uint8Array([0x02, 0x01, 0x01, 0x32, 0x02, 0x02, 0x32, 0x78])
const soundBuf2 = new Uint8Array([0x02, 0x06, 0xFF])


function connect() {
  const obniz = new Obniz(OBNIZ_ID)
  obniz.resetOnDisconnect(false)
  obniz.onconnect = async function () {
    let addressList = []
    const target = {
      localNamePrefix: 'toio',
    }
    await obniz.ble.initWait()
    const Toio_CoreCube = Obniz.getPartsClass('toio_CoreCube')
    obniz.ble.scan.onfind = async function (peripheral) {
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

    obniz.ble.scan.onfinish = async function (peripherals, error) {
      console.log('scan finished!')
      $('#status').text('scan finished!')
    }

    await obniz.ble.scan.startWait(target)

    $('#move-toio1').click(async function() {
      console.log('move toio pattern1')
      $('#status').text('move toio pattern1')
      const peripheralList = obniz.ble.getConnectedPeripherals()
      if (peripheralList.length > 0) {
        for (const peripheral of peripheralList) {
          await peripheral
            .getService(TOIO_SERVICE_UUID)
            .getCharacteristic(SOUND_CHARACTERISTIC_UUID)
            .writeWait(soundBuf1)
          await peripheral
            .getService(TOIO_SERVICE_UUID)
            .getCharacteristic(MOTOR_CHARACTERISTIC_UUID)
            .writeWait(motorBuf1)
        }
      }
    })

    $('#move-toio2').click(async function() {
      console.log('move toio pattern2')
      $('#status').text('move toio pattern2')
      const peripheralList = obniz.ble.getConnectedPeripherals()
      if (peripheralList.length > 0) {
        for (const peripheral of peripheralList) {
          await peripheral
              .getService(TOIO_SERVICE_UUID)
              .getCharacteristic(SOUND_CHARACTERISTIC_UUID)
              .writeWait(soundBuf2)
          await peripheral
              .getService(TOIO_SERVICE_UUID)
              .getCharacteristic(MOTOR_CHARACTERISTIC_UUID)
              .writeWait(motorBuf2)
        }
      }
    })

    // joystick
    // Javascript Example
    var joystick = obniz.wired("JoyStick", { gnd: 0, y: 3, x: 2, vcc: 1, sw: 5 });
    joystick.onchangex = function (val) {
      console.log("x: " + parseInt(1024 * val));
    };

    joystick.onchangey = function (val) { console.log("y: " + parseInt(1024 * val)); };

  }
}
