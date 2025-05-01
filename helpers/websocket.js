const crypto = require("crypto");

const clientsMap = new Map();
const HEARTBEAT_INTERVAL = 30000;

function sendToClients(filterFn, msg) {
  const data = typeof msg === "string" ? msg : JSON.stringify(msg);
  for (const client of clientsMap.values()) {
    if (filterFn(client)) {
      try {
        client.ws.send(data);
      } catch (err) {
        console.error("Send failed:", err);
      }
    }
  }
}

function sendAdminMessage(msg) {
  sendToClients(client => client.role === "admin", msg);
}

function sendMessageByUserID(msg, id) {
  const client = clientsMap.get(id);
  if (client) {
    try {
      const data = typeof msg === "string" ? msg : JSON.stringify(msg);
      client.ws.send(data);
    } catch (err) {
      console.error("Send to user failed:", err);
    }
  }
}

function sendBooking(msg) {
  sendToClients(
    client =>
      client.type === "Booking" &&
      msg.unitId?.toString() === client.unitId?.toString(),
    msg
  );
}

function sendBookingReceiptStatus(msg) {
  const status = Object.freeze({
    takeoverStatus: msg.takeoverStatus,
    handoverStatus: msg.handoverStatus,
  });

  sendToClients(
    client =>
      client.type === "updateBookingReceiptStatus" &&
      msg.bookId?.toString() === client.bookId?.toString(),
    status
  );
}

function updateClientData(wsId, updateObj) {
  const client = clientsMap.get(wsId);
  if (client) Object.assign(client, updateObj);
}

function removeClientById(wsId) {
  clientsMap.delete(wsId);
}

function heartbeat(ws) {
  ws.isAlive = true;
}

function webs(wss) {
  setInterval(() => {
    for (const ws of wss.clients) {
      if (ws.isAlive === false) {
        console.log("Terminating dead socket:", ws.id);
        removeClientById(ws.id);
        ws.terminate();
      } else {
        ws.isAlive = false;
        try {
          ws.ping();
        } catch (err) {
          console.error("Ping failed:", err);
        }
      }
    }
  }, HEARTBEAT_INTERVAL);

  wss.on("connection", (ws) => {
    ws.id = crypto.randomBytes(6).toString("hex");
    ws.isAlive = true;

    clientsMap.set(ws.id, {
      ws,
      role: null,
      type: null,
    });

    ws.on("pong", () => heartbeat(ws));

    ws.on("message", async (msg) => {
      try {
        const parsed = JSON.parse(msg);
        if (!parsed || typeof parsed !== "object") return;

        const updates = {};

        if (parsed.role) updates.role = parsed.role;
        if (parsed.type) {
          updates.type = parsed.type;

          if (parsed.type === "updateBookingReceiptStatus") {
            updates.bookId = parsed.bookId;
            updates.takeoverStatus = parsed.takeoverStatus;
            updates.handoverStatus = parsed.handoverStatus;

            if (parsed.actionType && parsed.actionStatus) {
              updates[parsed.actionType] = parsed.actionStatus;

              const bookingService = require("../modules/services/booking.service");
              bookingService.updateReceiptStatusForWS(
                parsed.bookId,
                parsed.actionType,
                parsed.actionStatus
              );
            }
          }
        }

        if (parsed.unitId) updates.unitId = parsed.unitId;
        if (parsed.info) updates.info = parsed.info;

        updateClientData(ws.id, updates);

        if (parsed.type === "updateBookingReceiptStatus") {
          sendBookingReceiptStatus({
            bookId: updates.bookId,
            takeoverStatus: updates.takeoverStatus,
            handoverStatus: updates.handoverStatus,
          });
        }

      } catch (err) {
        console.error("Invalid message received:", err.message);
        try {
          ws.send("Error: Invalid message format");
        } catch {}
      }
    });

    ws.on("close", () => removeClientById(ws.id));
    ws.on("error", () => removeClientById(ws.id));

    ws.send("Connected To WebSocket Server");
  });
}

module.exports = {
  webs,
  sendAdminMessage,
  sendMessageByUserID,
  sendBooking,
  sendBookingReceiptStatus,
};



// const crypto = require("crypto");

// const clientsMap = new Map();

// const HEARTBEAT_INTERVAL = 30000;
// const bookingService = require("../modules/services/booking.service");

// sendToClients = (filterFn, msg) => {
//   const data = typeof msg === "string" ? msg : JSON.stringify(msg);
//   clientsMap.forEach((client) => {
//     if (filterFn(client)) {
//       try {
//         client.ws.send(data);
//       } catch (err) {
//         console.error("Send failed:", err);
//       }
//     }
//   });
// };

// sendAdminMessage = (msg) => {
//   sendToClients((client) => client.role === "admin", msg);
// };

// sendMessageByUserID = (msg, id) => {
//   const client = clientsMap.get(id);
//   if (client) {
//     try {
//       client.ws.send(typeof msg === "string" ? msg : JSON.stringify(msg));
//     } catch (err) {
//       console.error("Send to user failed:", err);
//     }
//   }
// };
// sendBooking = (msg) => {
//   sendToClients(
//     (client) =>
//       client.type === "Booking" &&
//       msg.unitId?.toString() === client.unitId?.toString(),
//     msg
//   );
// };

// sendBookingReceiptStatus = (msg) => {
//   sendToClients(
//     (client) =>
//       client.type === "updateBookingReceiptStatus" &&
//       msg.bookId?.toString() === client.bookId?.toString(),
//     {
//       takeoverStatus: msg.takeoverStatus,
//       handoverStatus: msg.handoverStatus,
//     }
//   );
// };

// updateClientData = (wsId, updateObj) => {
//   const client = clientsMap.get(wsId);
//   if (client) Object.assign(client, updateObj);
// };
// removeClientById = (wsId) => {
//   clientsMap.delete(wsId);
// };

// heartbeat = (ws) => {
//   ws.isAlive = true;
// };

// function webs(wss) {
//   setInterval(() => {
//     for (let i = 0; i < wss.clients.length; i++) {
//       if (wss.clients[i].isAlive === false) {
//         console.log("Terminating dead socket:", wss.clients[i].id);
//         removeClientById(wss.clients[i].id);
//         wss.clients[i].terminate();
//       }
//       wss.clients[i].isAlive = false;
//       wss.clients[i].ping();
//     }
//   }, HEARTBEAT_INTERVAL);

//   wss.on("connection", (ws) => {
//     ws.id = crypto.randomBytes(6).toString("hex");
//     ws.isAlive = true;

//     clientsMap.set(ws.id, {
//       ws,
//       role: null,
//       type: null,
//     });

//     ws.on("pong", () => heartbeat(ws));

//     ws.on("message", async (msg) => {
//       try {
//         const parsed = JSON.parse(msg);
//         if (typeof parsed === "object") {
//           const updates = {};
//           if (parsed.role) updates.role = parsed.role;
//           if (parsed.type) {
//             updates.type = parsed.type;
//             if (parsed.type == "updateBookingReceiptStatus") {
//               updates.takeoverStatus = parsed.takeoverStatus;
//               updates.handoverStatus = parsed.handoverStatus;
//               updates.bookId = parsed.bookId;
//               if (parsed.actionType && parsed.actionStatus) {
//                 updates[parsed.actionType] = parsed.actionStatus;
                
//                 bookingService.updateReceiptStatusForWS(
//                   parsed.bookId,
//                   parsed.actionType,
//                   parsed.actionStatus
//                 );
//               }
//             }
//           }
//           if (parsed.unitId) updates.unitId = parsed.unitId;
//           if (parsed.info) updates.info = parsed.info;

//           updateClientData(ws.id, updates);
//           if (parsed.type == "updateBookingReceiptStatus") {
//             sendBookingReceiptStatus({
//               bookId: updates.bookId,
//               takeoverStatus: updates.takeoverStatus,
//               handoverStatus: updates.handoverStatus,
//             });
//           }
//         }
//       } catch (err) {
//         console.error("Invalid message received:", err);
//         ws.send("Error: Invalid message format");
//       }
//     });

//     ws.on("close", () => removeClientById(ws.id));
//     ws.on("error", () => removeClientById(ws.id));

//     ws.send("Connected To WebSocket Server");
//   });
// }

// module.exports = {
//   webs,
//   sendAdminMessage,
//   sendMessageByUserID,
//   sendBooking,
// };

// // const WebSocket = require("ws");
// // const wss = new WebSocket.Server({ port: 4001 });
// // const notificationController = require("../modules/controllers/notification.controller");
// let clientsList = [];
// const crypto = require("crypto");
// sendAdminMessage = (msg, res) => {
//   let data = JSON.stringify(msg);
//   clientsList.forEach((client) => {
//     if (client.role == "admin") {
//       client.ws.send(data);
//     }
//   });
// };
// sendMessageByUserID = (msg, id) => {
//   clientsList.forEach((client) => {
//     if (client.ws.id == id) {
//       client.ws.send(msg);
//     }
//   });
// };

// sendBooking = (msg) => {
//   let data = JSON.stringify(msg);

//   clientsList.forEach((client) => {
//     if (
//       client.type == "Booking" &&
//       msg.unitId.toString() == client.unitId.toString()
//     ) {
//       client.ws.send(data);
//     }
//   });
// };

// function webs(wss) {
//   wss.on("connection", (ws) => {
//     ws.id = crypto.randomBytes(6).toString("hex");

//     clientsList.push({
//       ws: ws,
//       role: "-----",
//       type: "-----",
//     });
//     ws.on("message", async (msg) => {
//       msg = JSON.parse(msg);
//       if (typeof msg == "object") {
//         if (msg.role) {
//           clientsList.forEach((client, i) => {
//             if (client.ws.id == ws.id) {
//               clientsList[i].role = msg.role;
//             }
//           });
//         }
//         if (msg.info) {
//           clientsList.forEach((client, i) => {
//             if (client.ws.id == ws.id) {
//               clientsList[i].info = msg.info;
//             }
//           });
//         }

//         if (msg.type) {
//           clientsList.forEach((client, i) => {
//             if (client.ws.id == ws.id) {
//               clientsList[i].type = msg.type;
//               if (msg.unitId) {
//                 clientsList[i].unitId = msg.unitId;
//               }
//             }
//           });
//         }
//       }

//       // try {
//       //   let result = await notificationController.callbackGetNotificationByUserId(
//       //     msg
//       //   );
//       //   if (result && result.length > 0) ws.send(JSON.stringify(result));
//       //   else ws.send("No Notifications Found");
//       // } catch (error) {
//       //   ws.send("No Notifications Found");
//       // }
//     });

//     ws.on("close", async (msg) => {
//       clientsList.forEach((client, i) => {
//         if (client.ws.id == ws.id) {
//           clientsList.splice(i, 1);
//         }
//       });
//     });

//     ws.on("error", async (msg) => {
//       clientsList.forEach((client, i) => {
//         if (client.ws.id == ws.id) {
//           clientsList.splice(i, 1);
//         }
//       });
//     });
//     ws.send("Connected To Websocket Server");
//   });
// }
// module.exports = {
//   webs,
//   sendAdminMessage,
//   sendMessageByUserID,
//   sendBooking,
// };
