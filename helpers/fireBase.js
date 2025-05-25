const FCM = require("fcm-node");
const sendFcm = (obj) => {
  try {
    let fcm = new FCM(process.env.FCMSERVERKAY);
    let message = {
    
      priority: "high",
      notification: {
        title: obj.title,
        body: obj.message,
        sound: "default",
        badge: "1",
        click_action: "FLUTTER_NOTIFICATION_CLICK",
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
        // id: obj.id,
        type: obj.type,
      },
    };

    if (obj.topic) {
      message.to = `/topics/${obj.topic}`;
    } else if (obj.deviceTokenList) {
      message.registration_ids = obj.deviceTokenList;
    } else if (obj.deviceToken) {
      message.to = obj.deviceToken;
    } else {
      return callback({
        err: "No target specified (topic or deviceTokens/deviceToken)",
      });
    }

    fcm.send(message, (err, response) => {
      if (err) {
        console.log(err,"vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
        
        // callback({ err });
      } else {
        console.log(response,"nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");

        // callback({ response: JSON.parse(response) });
      }
    });
  } catch (err) {
    console.log(err,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    
    // callback({ err });
  }
};
module.exports = {
  sendFcm,
};
