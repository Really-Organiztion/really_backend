const FCM = require("fcm-node");
const sendFcm = (ibj, callback) => {
  try {
    // let obj = req.body;
    let fcm = new FCM(process.env.FCMSERVERKAY);
    let message = {
      to: obj.deviceToken,
      priority: "high",
      collapse_key: "type_a",
      notification: {
        title: obj.title,
        body: obj.msgBody,
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        vibrate: [500, 1000, 500, 1000],
        // icon: "fcm_push_icon",
        // delivery_receipt_requested: true,
      },
      android: {
        priority: "high",
        notification: {
          notification_priority: "max",
          sound: "default",
          default_sound: true,
          default_vibrate_timings: true,
          default_light_settings: true,
        },
        vibrate_timings: [500, 1000, 500, 1000],
      },

      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        id: obj.id,
        type: obj.type,
      },
    };
    fcm.send(message, (err, response) => {
      if (err) {
        callback({ err });
      } else {
        console.log("rrrrrrrrrrrrrrrrrrrrrrrr", JSON.parse(response));
        // return res.status(200).send(JSON.parse(response));
        callback({ response: JSON.parse(response) });
      }
    });
  } catch (err) {
    callback({ err });
    // return callback({ err });
  }
};
module.exports = {
  sendFcm,
};
