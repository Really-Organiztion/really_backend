// const WebSocket = require("ws");
// const wss = new WebSocket.Server({ port: 4001 });
// const notificationController = require("../modules/controllers/notification.controller");
let clientsList = [];
const crypto = require("crypto");
sendAdminMessage = (msg, res) => {
  let data = JSON.stringify(msg);
  clientsList.forEach((client) => {
    if (client.role == "admin") {
      client.ws.send(data);
    }
  });
};
sendMessageByUserID = (msg, id) => {
  clientsList.forEach((client) => {
    if (client.ws.id == id) {
      client.ws.send(msg);
    }
  });
};

sendBooking = (msg) => {
  let data = JSON.stringify(msg);

  clientsList.forEach((client) => {
    if (
      client.type == "Booking" &&
      msg.unitId.toString() == client.unitId.toString()
    ) {
      client.ws.send(data);
    }
  });
};

function webs(wss) {
  wss.on("connection", (ws) => {
    ws.id = crypto.randomBytes(6).toString("hex");

    clientsList.push({
      ws: ws,
      role: "-----",
      type: "-----",
    });
    ws.on("message", async (msg) => {
      msg = JSON.parse(msg);
      if (typeof msg == "object") {
        if (msg.role) {
          clientsList.forEach((client, i) => {
            if (client.ws.id == ws.id) {
              clientsList[i].role = msg.role;
            }
          });
        }
        if (msg.info) {
          clientsList.forEach((client, i) => {
            if (client.ws.id == ws.id) {
              clientsList[i].info = msg.info;
            }
          });
        }

        if (msg.type) {
          clientsList.forEach((client, i) => {
            if (client.ws.id == ws.id) {
              clientsList[i].type = msg.type;
              if (msg.unitId) {
                clientsList[i].unitId = msg.unitId;
              }
            }
          });
        }
      }

      // try {
      //   let result = await notificationController.callbackGetNotificationByUserId(
      //     msg
      //   );
      //   if (result && result.length > 0) ws.send(JSON.stringify(result));
      //   else ws.send("No Notifications Found");
      // } catch (error) {
      //   ws.send("No Notifications Found");
      // }
    });

    ws.on("close", async (msg) => {
      clientsList.forEach((client, i) => {
        if (client.ws.id == ws.id) {
          clientsList.splice(i, 1);
        }
      });
    });

    ws.on("error", async (msg) => {
      clientsList.forEach((client, i) => {
        if (client.ws.id == ws.id) {
          clientsList.splice(i, 1);
        }
      });
    });
    ws.send("Connected To Websocket Server");
  });
}
module.exports = {
  webs,
  sendAdminMessage,
  sendMessageByUserID,
  sendBooking,
};
