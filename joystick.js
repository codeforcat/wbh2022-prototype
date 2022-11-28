/**
 * Copyright (c) 2019-present, Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const OBNIZ_ID = '8066-1619'
const TARGET_OBNIZ_ID = '6119-5084'

function connect() {
  const obniz = new Obniz(OBNIZ_ID)
  obniz.resetOnDisconnect(false)
  obniz.onconnect = async function () {
    let addressList = []



    // joystick
    // Javascript Example
    var state = "normal";
    var x = y = tmp_x = tmp_y = 512;
    var joystick = obniz.wired("JoyStick", { gnd: 0, y: 3, x: 2, vcc: 1, sw: 5 });
    joystick.onchangex = function (val) {
      x = parseInt(1024 * val);
      // console.log(x," ",y)
      if (x > 1000) {
        if (state != "pain") {
          state = "pain";
          console.log("pain," + x);
        }
      } else if(abs(tmp_x - x) > 100) {
        if (state != "gain") {
          state = "gain";
          console.log("gain," + x);
        }

      } else {
        state = "normal"
      }
      tmp_x = x;
    };

    joystick.onchangey = function (val) {
      y = parseInt(1024 * val);
      // console.log(x," ",y)
      if (abs(tmp_y - y) > 100) {
        if (state != "gain") {
          state = "gain";
          console.log("gain," + y);
        }
      }else {
        state = "normal"
      }
      tmp_y = y;
    };

  }
}

function abs(val) {
  return val < 0 ? -val : val;
};

