/**
 * Copyright (c) 2019-present, Sony Interactive Entertainment Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
 const OBNIZ_ID = '8066-1619'
//  const TARGET_OBNIZ_ID = '8066-1619'
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
    var joystick = obniz.wired("JoyStick", { gnd: 0, vcc: 1, x: 2, y: 3, sw: 4 });
    /**
     * GROVE JOYSTICK
     * swはないのでダミー
     * x,yアナログ
     * ボタン押下はx=1
     */
    joystick.onchangex = function (val) {
      x = parseInt(1024 * val);
      // console.log(x," ",y)
      // x > 1000でボタン押下とみなす-> pain判定
      if (x > 1000) {
        if (state != "pains") {
          state = "pains";
          console.log("pains," + x);
          // toioのobnizへメッセージ送る
          obniz.message(TARGET_OBNIZ_ID, "pains");

        }
        // 前回と100動いていればgain状態とみなす
      } else if (abs(tmp_x - x) > 100) {
        if (state != "gains") {
          state = "gains";
          console.log("gains," + x);
          // toioのobnizへメッセージ送る
          obniz.message(TARGET_OBNIZ_ID, "gains");
        }

      } else {
        state = "normal"
      }
      tmp_x = x;
    };

    joystick.onchangey = function (val) {
      y = parseInt(1024 * val);
      // console.log(x," ",y)
        // 前回と100動いていればgain状態とみなす
        if (abs(tmp_y - y) > 100) {
        if (state != "gains") {
          state = "gains";
          console.log("gains," + y);
          // toioのobnizへメッセージ送る
          obniz.message(TARGET_OBNIZ_ID, "gains");
        }
      } else {
        state = "normal"
      }
      tmp_y = y;
    };

  }
  // デバッグ用
  obniz.onmessage = function (message, from) {
    if (message === "pains") {
      console.log("painメッセージが来たよ")
    }
    if (message === "gains") {
      console.log("gainメッセージが来たよ")
    }
  };
}

function abs(val) {
  return val < 0 ? -val : val;
};

