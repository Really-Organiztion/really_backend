const notificationController = require("../modules/controllers/notification.controller");

module.exports = function (wss) {
  wss.on("connection", (ws) => {
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });
    //connection is up, let's add a simple simple event
    ws.on("message", async (msg) => {
      //log the received msg and send it back to the client
      try {
        let result = await notificationController.callbackGetNotificationByUserId(
          msg
        );
        if (result && result.length > 0) ws.send(JSON.stringify(result));
        else ws.send("No Notifications Found");
      } catch (error) {
        ws.send("No Notifications Found");
      }
    });
    //send immediatly a feedback to the incoming connection
    ws.send("Connected To Websocket Server");
  });
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();

      ws.isAlive = false;
      ws.ping(null, false, true);
    });
  }, 30000);
};
