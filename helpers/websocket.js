const notificationController = require("../modules/controllers/notification.controller");
let clientsList = [];

sendAdminMessage = (msg) => {
  clientsList.forEach((client) => {
    if (client.type == "admin") {
      client.ws.send(msg);
    }
  });
};
sendMessageByID = (msg, id) => {
  clientsList.forEach((client) => {
    if (client.id == id) {
      client.ws.send(msg);
    }
  });
};
module.exports = function (wss) {
  wss.on("connection", (ws) => {
    clientsList.push({
      ws: ws,
      role: "-----",
    });
    ws.on("message", async (msg) => {
      if (msg.type == "role") {
        clientsList.forEach((client, i) => {
          if (client.ws.id == ws.id) {
            clientsList[i].role = msg.role;
          }
        });
      } else if (msg.type == "info") {
        clientsList.forEach((client, i) => {
          if (client.ws.id == ws.id) {
            clientsList[i].info = msg.info;
          }
        });
      }

      try {
        let result =
          await notificationController.callbackGetNotificationByUserId(msg);
        if (result && result.length > 0) ws.send(JSON.stringify(result));
        else ws.send("No Notifications Found");
      } catch (error) {
        ws.send("No Notifications Found");
      }
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
};
