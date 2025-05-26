const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const sendFcm = async (obj) => {
  try {
    const messaging = admin.messaging();

    if (obj.topic) {
      const message = {
        topic: obj.topic,
        notification: {
          title: obj.title,
          body: obj.message,
        },
        android: {
          priority: "HIGH",
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
              badge: 1,
              category: "FLUTTER_NOTIFICATION_CLICK",
            },
          },
        },
        data: {
          click_action: "FLUTTER_NOTIFICATION_CLICK",
          type: obj.type || "",
        },
      };

      const response = await messaging.send(message);
      console.log("FCM response:", response);
      return response;
    } else if (
      obj.deviceTokenList &&
      Array.isArray(obj.deviceTokenList) &&
      obj.deviceTokenList.length > 0
    ) {
      const messages = obj.deviceTokenList.map((token) => ({
        token,
        notification: {
          title: obj.title,
          body: obj.message,
        },
        android: {
          priority: "HIGH",
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
              badge: 1,
              category: "FLUTTER_NOTIFICATION_CLICK",
            },
          },
        },
        data: {
          click_action: "FLUTTER_NOTIFICATION_CLICK",
          type: obj.type || "",
        },
      }));

      const response = await messaging.sendEach(messages);
      console.log("FCM response:", response);

      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`Error sending to token[${idx}]:`, resp.error.message);
        }
      });

      return response;
    } else if (obj.deviceToken) {
      const message = {
        token: obj.deviceToken,
        notification: {
          title: obj.title,
          body: obj.message,
        },
        android: {
          priority: "HIGH",
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
              badge: 1,
              category: "FLUTTER_NOTIFICATION_CLICK",
            },
          },
        },
        data: {
          click_action: "FLUTTER_NOTIFICATION_CLICK",
          type: obj.type || "",
        },
      };

      const response = await messaging.send(message);
      console.log("FCM response:", response);
      return response;
    } else {
      console.error(
        "No target specified (topic or deviceTokenList or deviceToken)"
      );
      return;
    }
  } catch (err) {
    console.error("An error occurred while sending notifications.", err);
    throw err;
  }
};

module.exports = {
  sendFcm,
};

// // const FCM = require("fcm-node");
// // const sendFcm = (obj) => {
// //   try {
// //     let fcm = new FCM(process.env.FCMSERVERKAY);
// //     let message = {

// //       priority: "high",
// //       notification: {
// //         title: obj.title,
// //         body: obj.message,
// //         sound: "default",
// //         badge: "1",
// //         click_action: "FLUTTER_NOTIFICATION_CLICK",
// //       },
// //       android: {
// //         priority: "high",
// //         notification: {
// //           notification_priority: "max",
// //           sound: "default",
// //           default_sound: true,
// //           default_vibrate_timings: true,
// //           default_light_settings: true,
// //         },
// //         vibrate_timings: [500, 1000, 500, 1000],
// //       },

// //       data: {
// //         click_action: "FLUTTER_NOTIFICATION_CLICK",
// //         // id: obj.id,
// //         type: obj.type,
// //       },
// //     };

// //     if (obj.topic) {
// //       message.to = `/topics/${obj.topic}`;
// //     } else if (obj.deviceTokenList) {
// //       message.registration_ids = obj.deviceTokenList;
// //     } else if (obj.deviceToken) {
// //       message.to = obj.deviceToken;
// //     } else {
// //       return callback({
// //         err: "No target specified (topic or deviceTokens/deviceToken)",
// //       });
// //     }

// //     fcm.send(message, (err, response) => {
// //       if (err) {
// //         console.log(err,"vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");

// //         // callback({ err });
// //       } else {
// //         console.log(response,"nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");

// //         // callback({ response: JSON.parse(response) });
// //       }
// //     });
// //   } catch (err) {
// //     console.log(err,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

// //     // callback({ err });
// //   }
// // };
// // module.exports = {
// //   sendFcm,
// // };
