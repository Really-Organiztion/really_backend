const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccount.json");

const serviceAccount = {
  type: "service_account",
  project_id: "really-booking",
  private_key_id: "d365fc79656349a61346c6de01dbb946dd5df2c1",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFrESFhj5AI7Ym\niaEhycGFPX3bIpqtTXmwliO/3kyRWjdtkRkfht2XBwdNOthi5SOMGL0o6AySXK4F\nsbckoLnOjiS2QX8T29/wH2Jh8dYzEWYseiGWlnZoLbrNQBUZvuEADNJSYAvHUiiS\nWzHl7tRFmMCzULY8S+aOl2D93bnLIufTPamd7d/qMVsbxVfx7XZo8l4H2A5+ttMd\nN7brkRCWmONfDplCaLXXioqoNf6ClUbIDz6FEMk5gGH20QrWkTMOfa7m3UmuMSR0\n/ofKuE1m1KLg/TsIOLtCxuEI4YVt8r5PJiKKpdMxY6pQg8XHkGGw4MdvpP03ahCh\nHDEZg+l3AgMBAAECggEAEB11Wp4GmNZbJQonA5OoqLL00zbKKGMUDs7hVuTfFiHQ\n5KhQcC8KWqPSjGZwj04XQfZ0WWTi6ChmcYVlpQv2CekHBNVocEHbyv4sAvMjH3ew\nKOPDYDz0+z+bJoeDu4fBsm4ufqkLh3I4Z4dyv8g4MFJTMhXcPXnXRScB28BwmKb4\n70+v3hD/xn9UILMgZ2uDdvokeWJgAlCHYRt7a2DUKRTctIK2ZEL1trtSOjgBRKMU\n5Y+vQ8QjWblEPE/ohjJMLuTDHkHYWcM5ZLDiB1CffVPcjR9owJPP4XAhuN+zOCXd\nl5U9x8acYcLDz5xH0PechZAJRMqKJSqkJTTUUnAumQKBgQDUPOD2v5IN/xcX1TJ/\n37dWYV8oUNtOyxByqHQDIVtJpSWd6zs0r7ZF8HmIMEuRcOqUDc44GjwQsUDqzhYk\nAmuET2+7XaQ2euDoOXPpTf/avyS6IhwGpn9yUWbp7gvLWNgBmqdDtUAGlF4388LP\nKBOxRXdqz3f5Fbl63UC0RdiTOQKBgQDubpI194c68oxfn7LaoeElYWjtbyujcGJH\n4Jpf5+/sdvKI7CCet/1ea6kb0kN99cmkM9uEqrKl3juuoexdjFbz3riAwWus+jQc\nIkLhXdcZQbMwazDQFL7sxmkqSQ9teWTLL4xjkHg7GkuK3FSDFsIR8QbbfO2GN839\nWxnnLz3yLwKBgQCEi9SvJSrw5MumTbZxF+Vm4/7KrdyY08bc5Ik3X0CkuKfKfRsH\np2j9OtabkBXRqiRF/G06ql+yyRBS1AwNxxkgk3+jEzM39vu47BCQtu6/zToBqMW5\n/YeAfIf6NnlVMJIORmiJp4tp0IUbCngyacQKpOiUYyd4/vFMYxtCupAsOQKBgQCY\n+Onno/LoF/uF0lEOwnNP50pJo1ytFIqJsQl6ZLVi0gHTZSOckVEGhi5OQj25D7ua\nFQdO+7F4h7dk2FBsyIB1IDzhprbtmO1b64NbUjiR5LwRYYREzDqecMHCNnOmeg73\n6X651lO9H6a95ZR3Ml+64RfUNDe0OBN57DwXPhERUwKBgDO4C+BhHTKl/HHHCdPP\n/U4k7tfvptO8IP3ARv4beDjkBZ8jw9TFz30fqmTzdu8QytL/ULW3XvgQkh8/uCpr\nSBhROEUSOZcs63ifIv5wFqXTDVkGIzbV9urjfCJ/8BKKm+SOJ6DlIw6w6JlI9jse\nRl+DTnDtFwXHjwjzCeBbnK/y\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-ndhpw@really-booking.iam.gserviceaccount.com",
  client_id: "113721007637571411913",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ndhpw%40really-booking.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
console.log(serviceAccount);

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

// const FCM = require("fcm-node");
// const sendFcm = (obj) => {
//   try {
//     let fcm = new FCM(process.env.FCMSERVERKAY);
//     let message = {

//       priority: "high",
//       notification: {
//         title: obj.title,
//         body: obj.message,
//         sound: "default",
//         badge: "1",
//         click_action: "FLUTTER_NOTIFICATION_CLICK",
//       },
//       android: {
//         priority: "high",
//         notification: {
//           notification_priority: "max",
//           sound: "default",
//           default_sound: true,
//           default_vibrate_timings: true,
//           default_light_settings: true,
//         },
//         vibrate_timings: [500, 1000, 500, 1000],
//       },

//       data: {
//         click_action: "FLUTTER_NOTIFICATION_CLICK",
//         // id: obj.id,
//         type: obj.type,
//       },
//     };

//     if (obj.topic) {
//       message.to = `/topics/${obj.topic}`;
//     } else if (obj.deviceTokenList) {
//       message.registration_ids = obj.deviceTokenList;
//     } else if (obj.deviceToken) {
//       message.to = obj.deviceToken;
//     } else {
//       return callback({
//         err: "No target specified (topic or deviceTokens/deviceToken)",
//       });
//     }

//     fcm.send(message, (err, response) => {
//       if (err) {
//         console.log(err,"vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");

//         // callback({ err });
//       } else {
//         console.log(response,"nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");

//         // callback({ response: JSON.parse(response) });
//       }
//     });
//   } catch (err) {
//     console.log(err,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

//     // callback({ err });
//   }
// };
// module.exports = {
//   sendFcm,
// };
