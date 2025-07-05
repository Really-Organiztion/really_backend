const notificationService = require("../services/notification.service");
const logger = require("../../helpers/logging");
const fireBase = require("../../helpers/fireBase");
const userService = require("../services/user.service");

getAllData = (req, res) => {
  try {
    notificationService.findAll(req, res);
  } catch (error) {
    console.log(error);

    logger.error(error);
  }
};

create = (req, res) => {
  try {
    notificationService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

 send = async (req, res) => {
  try {
    const { action, type, userIdList, userId } = req.body;
    let notificationList = [];
    let deviceTokenList = [];

    if (action !== "Send") {
      const userList = await getTargetUsers(type, userIdList, userId);

      if (type === "Private") {
        if (!req.body.deviceToken) {
          req.body.deviceToken = userList?.[0]?.deviceToken;          
        }
        notificationList.push({ ...req.body });
      } else {
        for (const user of userList) {
          notificationList.push({ ...req.body, userId: user._id });
          if (user.deviceToken) deviceTokenList.push(user.deviceToken);
        }
      }

      fireBase.sendFcm({ ...req.body, deviceTokenList });

      await notificationService.createMany(notificationList);
    }

    if (action !== "Save" && deviceTokenList.length > 0) {
      req.body.deviceTokenList = deviceTokenList;
      await fireBase.sendFcm({...req.body});
    }

    return res.status(200).send({ message: "Success" });
  } catch (error) {
    logger.error(error);    
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const getTargetUsers = async (type, userIdList, userId) => {
  const commonFilter = { status: "Active", isDeleted: false };

  switch (type) {
    case "Renter":
    case "Investor":
    case "Owner":
      return await userService.getAllIdAndDeviceToken({
        ...commonFilter,
        role: type,
      });

    case "Public":
      return await userService.getAllIdAndDeviceToken(commonFilter);

    case "Private":
      return await userService.getAllIdAndDeviceToken({_id: userId});

    case "Custom":
      if (Array.isArray(userIdList) && userIdList.length > 0) {
        return await userService.getAllIdAndDeviceToken({
          _id: { $in: userIdList },
        });
      }
      return [];

    default:
      return [];
  }
};

// const send = async (req, res) => {
//   try {
//     let notificationList = [];
//     let deviceTokenList = [];

//     if (req.body.action !== "Send") {
//       if (req.body.type === "Private") {
//         notificationList = [{ ...req.body }];
//       } else if (["Renter", "Investor", "Owner"].includes(req.body.type)) {
//         const userList = await userService.getAllIdAndDeviceToken({
//           role: req.body.type,
//           status: "Active",
//           isDeleted: false,
//         });
//         for (let i = 0; i < userList.length; i++) {
//           notificationList.push({ ...req.body, userId: userList[i]._id });
//           deviceTokenList.push(userList[i].deviceToken);
//         }
//       } else if (req.body.type === "Public") {
//         const userList = await userService.getAllIdAndDeviceToken({
//           status: "Active",
//           isDeleted: false,
//         });
//         for (let i = 0; i < userList.length; i++) {
//           notificationList.push({ ...req.body, userId: userList[i]._id });
//           deviceTokenList.push(userList[i].deviceToken);
//         }
//       } else if (req.body.type === "Custom") {
//         if (req.body.userIdList) {
//           const userList = await userService.getAllIdAndDeviceToken({
//             _id: { $in: req.body.userIdList },
//           });
//           for (let i = 0; i < userList.length; i++) {
//             notificationList.push({ ...req.body, userId: userList[i]._id });
//             deviceTokenList.push(userList[i].deviceToken);
//           }
//         }
//       }

//       fireBase.sendFcm({ ...req.body, deviceTokenList });

//       notificationService.createMany(notificationList);
//     } else if (req.body.action !== "Save") {
//       if (deviceTokenList.length > 0) {
//         req.body.deviceTokenList = deviceTokenList;
//       }

//       fireBase.sendFcm(req.body);
//     }

//     return res.status(200).send({ message: "Success" });
//   } catch (error) {
//     logger.error(error);
//     return res.status(500).send({ error: "Internal Server Error" });
//   }
// };

findById = (req, res) => {
  try {
    const id = req.params.id;
    notificationService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
seen = (req, res) => {
  try {
    const id = req.params.id;
    notificationService.seen(res, id);
  } catch (error) {
    logger.error(error);
  }
};

updateNotification = (req, res) => {
  try {
    const id = req.params.id;
    notificationService.updateNotification(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteNotification = (req, res) => {
  try {
    const id = req.params.id;
    notificationService.deleteNotification(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteUserNotifications = (req, res) => {
  try {
    const id = req.params.id;

    notificationService.deleteUserNotifications(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

getNotificationByUserId = (req, res) => {
  try {
    const id = req.params.id;
    notificationService.getNotificationByUserId(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
callbackGetNotificationByUserId = (id) => {
  try {
    return notificationService.callbackGetNotificationByUserId(id);
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  send,
  getAllData,
  create,
  findById,
  updateNotification,
  seen,
  deleteNotification,
  deleteUserNotifications,
  getNotificationByUserId,
  callbackGetNotificationByUserId,
};
