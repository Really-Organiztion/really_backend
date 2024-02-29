const notificationController = require("../modules/controllers/notification.controller");
let clientsList = [];

module.exports = function (wss) {
  wss.on("connection", (ws) => {
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });
    ws.on("message", async (msg) => {
      try {
        let result =
          await notificationController.callbackGetNotificationByUserId(msg);
        if (result && result.length > 0) ws.send(JSON.stringify(result));
        else ws.send("No Notifications Found");
      } catch (error) {
        ws.send("No Notifications Found");
      }
    });
    ws.send("Connected To Websocket Server");
  });
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();

      ws.isAlive = false;
      ws.ping(null, false, true);
    });
  }, 30 * 1000);
};
