const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const userModel = require("../models/user.model");
const userOptModel = require("../models/userOpt.model");
const requestModel = require("../models/request.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const handleFiles = require("../../helpers/handleFiles");
const webSocket = require("../../helpers/websocket");
const attachmentPath = require("../../helpers/attachmentPath.json");
const path = attachmentPath.attachments;
const mailer = require("../../helpers/sendMail");

findUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let user = await userModel.defaultSchema.findOne({ email });
  if (!user) res.status(400).send("Invalid email or password");
  else if (user && !user.emailVerify)
    res.status(400).send("Mail must be verified before login");
  else {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
    else {
      const ONE_WEEK = 604800;
      //Generating the token
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.SECRET,
        {
          expiresIn: ONE_WEEK,
        }
      );

      let newUser = { password, ...user };
      delete newUser._doc.password;
      return res.status(200).send({
        success: true,
        message: "You can login now",
        user: newUser._doc,
        token,
      });
    }
  }
};
socialMediaLogin = async (req, res) => {
  const email = req.body.email;
  userModel.defaultSchema
    .findOneAndUpdate(
      { email },
      { $set: { socialMediaToken: req.body.socialMediaToken } },
      {
        new: true,
        setDefaultsOnInsert: true,
      }
    )
    .then(function (user) {
      if (!user) res.status(400).send("Invalid email");
      else {
        const ONE_WEEK = 604800;
        const token = jwt.sign(
          {
            id: user._id,
          },
          process.env.SECRET,
          {
            expiresIn: ONE_WEEK,
          }
        );
        let newUser = { ...user };
        delete newUser._doc.password;
        return res.status(200).send({
          success: true,
          message: "You can login now",
          user: newUser._doc,
          token,
        });
      }
    })
    .catch(function (err1) {
      res.status(400).send(err1);
    });
};
findAllUsers = async (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let where = req.body || {};
  if (where["username"]) {
    where["username"] = { $regex: where["username"], $options: "i" };
  }

  if (where["job"]) {
    where["job"] = { $regex: where["job"], $options: "i" };
  }

  if (where["countryId"]) {
    where["countryId"] = new ObjectId(where["countryId"]);
  }

  if (where.birthDate) {
    let d1 = new Date(where.birthDate);
    let d2 = new Date(where.birthDate);
    d2.setDate(d2.getDate() + 1);
    where.birthDate = {
      $gte: d1,
      $lt: d2,
    };
  }

  if (where.createdAt) {
    let d1 = new Date(where.createdAt);
    let d2 = new Date(where.createdAt);
    d2.setDate(d2.getDate() + 1);
    where.createdAt = {
      $gte: d1,
      $lt: d2,
    };
  }

  if (where.updatedAt) {
    let d1 = new Date(where.updatedAt);
    let d2 = new Date(where.updatedAt);
    d2.setDate(d2.getDate() + 1);
    where.updatedAt = {
      $gte: d1,
      $lt: d2,
    };
  }

  if (where["search"]) {
    where.$or = [
      { firstName: { $regex: where["search"], $options: "i" } },
      { lastName: { $regex: where["search"], $options: "i" } },
      { username: { $regex: where["search"], $options: "i" } },
      { email: { $regex: where["search"], $options: "i" } },
      { phone: { $regex: where["search"], $options: "i" } },
      { status: { $regex: where["search"], $options: "i" } },
      { verifyIdentityType: { $regex: where["search"], $options: "i" } },
      { nationalID: { $regex: where["search"], $options: "i" } },
      { role: { $regex: where["search"], $options: "i" } },
      { idType: { $regex: where["search"], $options: "i" } },
      { job: { $regex: where["search"], $options: "i" } },
      { phonesList: { $regex: where["search"], $options: "i" } },
      { gender: { $regex: where["search"], $options: "i" } },
    ];
    delete where["search"];
  }

  if (where["fullName"]) {
    where.$or = [
      { firstName: { $regex: where["fullName"], $options: "i" } },
      { lastName: { $regex: where["fullName"], $options: "i" } },
    ];
    delete where["fullName"];
  }

  if (where["phone"]) {
    where.$or = [
      { phone: { $regex: where["phone"], $options: "i" } },
      { phonesList: { $regex: where["phone"], $options: "i" } },
    ];
  }

  let users = await userModel.defaultSchema
    .find(where)
    .populate("countryId", [`${toFound}`, "code", "numericCode"])

    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .select({ password: 0, __v: 0 });
  if (!users) res.status(400).send("No Users Found");
  else return res.status(200).send(users);
};
addPurchaseIntoUser = async (req, res, id, type) => {
  return new Promise((resolve, reject) => {
    const lessonIds = req.body.lessons.map((e) => e.lessonId);
    userModel.defaultSchema.updateOne(
      {
        _id: ObjectId(id),
        // "lessons.lessonId": { $nin: lessonIds },
      },
      {
        $addToSet: {
          courses: req.body.courseId,
          lessons: req.body.lessons,
        },
      },
      {
        // While Update: show last updated document with new values
        new: true,
        // While Update: the default values will inserted without passing values explicitly
        setDefaultsOnInsert: true,
      },
      function (err, data) {
        if (err) res.status(400).send(err);
        else if (data === null) res.status(404).send("User ID is not found");
        else {
          if (type === "other") {
            resolve(data);
          } else {
            if (data.nModified === 0) {
              res
                .status(200)
                .send(
                  "No Data has Modified, Maybe there is a repeating in data"
                );
            } else {
              res.status(200).send("Data has Modified");
            }
          }
        }
      }
    );
  });
};
updateUserLessonPurchase = async (req, res) => {
  return new Promise((resolve, reject) => {
    const date = new Date();
    const endDate = date.setDate(date.getDate() + req.body.validFor);
    userModel.defaultSchema.updateOne(
      {
        _id: ObjectId(req.body.userId),
        "lessons.lessonId": req.body.lessonId,
      },
      {
        $set: {
          "lessons.$.seen": true,
          "lessons.$.validFor": req.body.validFor,
          "lessons.$.startDate": new Date(),
          "lessons.$.endDate": endDate,
        },
      },
      {
        // While Update: show last updated document with new values
        new: true,
        // While Update: the default values will inserted without passing values explicitly
        setDefaultsOnInsert: true,
      },
      function (err, data) {
        if (err) reject(err);
        else if (data === null) reject("ID is not found");
        else resolve("Data updated successfully");
      }
    );
  });
};
findUserCourses = async (req, res, id) => {
  return new Promise((resolve, reject) => {
    const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    userModel.defaultSchema
      .find({ _id: ObjectId(id) })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select({ courses: 1, lessons: 1 })
      .exec((err, data) => {
        if (err) res.status(400).send(err);
        else {
          if (data[0].courses.length > 0) {
            resolve(data);
          } else {
            if (data[0].courses.length === 0) {
              res.status(200).send([]);
            } else {
              res.status(200).send(data);
            }
          }
        }
      });
  });
};
findUserLessons = async (req, res, id, type) => {
  return new Promise((resolve, reject) => {
    const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    userModel.defaultSchema
      .find({ _id: ObjectId(id) })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select({ lessons: 1 })
      .exec((err, data) => {
        if (err) res.status(400).send(err);
        else {
          if (type === "other") {
            resolve(data);
          } else {
            res.status(200).send(data);
          }
        }
      });
  });
};
addFavoriteIntoUser = async (req, res, id) => {
  userModel.defaultSchema.findByIdAndUpdate(
    id,
    {
      $addToSet: {
        favorites: req.body.courseId,
      },
    },
    {
      // While Update: show last updated document with new values
      new: true,
      // While Update: the default values will inserted without passing values explicitly
      setDefaultsOnInsert: true,
    },
    function (err, data) {
      if (err) res.status(400).send(err);
      else if (data === null) res.status(404).send("ID is not found");
      else res.status(200).send(data);
    }
  );
};
removeUserFavorite = async (req, res, id, courseId) => {
  userModel.defaultSchema.findByIdAndUpdate(
    id,
    { $pull: { favorites: courseId } },
    { safe: true, multi: true },
    function (err, data) {
      if (err) res.status(400).send(err);
      else if (data === null) res.status(404).send("ID is not found");
      else res.sendStatus(200);
    }
  );
};
findUserFavorites = async (req, res, id) => {
  return new Promise((resolve, reject) => {
    const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    userModel.defaultSchema
      .find({ _id: ObjectId(id) })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select({ favorites: 1 })
      .exec((err, data) => {
        if (err) res.status(400).send(err);
        else {
          if (data[0].favorites.length > 0) {
            resolve(data[0].favorites);
          } else {
            res.status(200).send(data);
          }
        }
      });
  });
};
checkUserCourseInFavorite = async (req, res, userId, courseId) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  userModel.defaultSchema
    .find({ _id: ObjectId(userId), favorites: { $in: ObjectId(courseId) } })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .select({ favorites: 1 })
    .exec((err, data) => {
      if (err) res.status(400).send(err);
      else {
        if (data && data.length > 0) res.status(200).send("Found");
        else res.status(404).send("Not Found");
      }
    });
};
changePassword = async (req, res, id) => {
  let user = await userModel.defaultSchema.findOne({ _id: id });
  if (!user) res.status(400).send("Invalid data");
  else {
    const validPassword = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );
    if (!validPassword) return res.status(400).send("Wrong old password");
    else {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return callback(err);
        }
        bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
          if (err) {
            return next(err);
          }
          req.body.newPassword = hash;
          userModel.defaultSchema
            .findByIdAndUpdate(
              id,
              { $set: { password: req.body.newPassword } },
              {
                setDefaultsOnInsert: true,
              }
            )
            .then(function () {
              res
                .status(200)
                .send("The password has been changed successfully");
            })
            .catch(function (err) {
              res.status(400).send(err);
            });
        });
      });
    }
  }
};
findUserById = (id) => {
  return new Promise(async (resolve, reject) => {
    const user = await userModel.defaultSchema.findById(id);
    if (user) resolve(user);
    else reject(user);
  });
};
findUserByEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    const user = await userModel.defaultSchema.findOne({ email });
    resolve(user);
  });
};
addPromoIntoUser = async (req, res) => {
  return new Promise((resolve, reject) => {
    userModel.defaultSchema.updateOne(
      {
        _id: ObjectId(req.body.userId),
      },
      {
        $addToSet: {
          promoCodes: req.body.promoCode,
        },
      },
      {
        // While Update: show last updated document with new values
        new: true,
        // While Update: the default values will inserted without passing values explicitly
        setDefaultsOnInsert: true,
      },
      function (err, data) {
        if (err) reject(err);
        else if (data === null) reject("User ID is not found");
        else resolve(data);
      }
    );
  });
};
verifyEmail = async (req, res) => {
  userOptModel.defaultSchema
    .findOne({
      email: req.body.email,
      otp: req.body.otpCode,
    })
    .then(function (_obj) {
      if (_obj) {
        userModel.defaultSchema
          .findOneAndUpdate(
            { email: req.body.email },
            { $set: { emailVerify: true } },
            {
              new: true,
              setDefaultsOnInsert: true,
            }
          )
          .then(function () {
            res.status(200).send("Email verify is susses");
          })
          .catch(function (err) {
            res.status(400).send(err);
          });
      } else {
        res.status(400).send("Opt Code is wrong");
      }
    })
    .catch(function (err1) {
      res.status(400).send(err1);
    });
};
forgetPassword = async (req, res) => {
  userOptModel.defaultSchema
    .findOne({
      email: req.body.email,
      otp: req.body.otpCode,
    })
    .then(function (_obj) {
      if (_obj) {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            return callback(err);
          }
          bcrypt.hash(req.body.newPassword, salt, (err2, hash) => {
            if (err2) {
              return next(err2);
            }
            req.body.newPassword = hash;
            userModel.defaultSchema
              .findOneAndUpdate(
                { email: req.body.email },
                { $set: { password: req.body.newPassword } },
                {
                  new: true,
                }
              )
              .then(function (_obj) {
                res
                  .status(200)
                  .send("The password has been changed successfully");
              })
              .catch(function (err1) {
                res.status(400).send(err1);
              });
          });
        });
      } else {
        res.status(400).send("There is no code");
      }
    })
    .catch(function (err1) {
      res.status(400).send(err1);
    });
};

getOptEmail = async (req, res) => {
  userOptModel.defaultSchema
    .findOne({
      email: req.body.email,
    })
    .then(function (_obj) {
      if (_obj) {
        res.status(200).send(_obj);
      } else {
        res.status(400).send("There is no code");
      }
    })
    .catch(function (err1) {
      res.status(400).send(err1);
    });
};
generatOptEmail = async (req, res) => {
  userOptModel.defaultSchema
    .findOne({
      email: req.body.email,
    })
    .then(function (_obj) {
      if (_obj) {
        res
          .status(400)
          .send("You must wait 5 minutes before sending another code");
      } else {
        let optModel = {
          otp: Math.floor(Math.random() * 90000) + 10000,
          email: req.body.email,
        };
        userOptModel.defaultSchema.create(optModel).then(function (models1) {
          let mailOptions = {
            from: process.env.GMAILUSER,
            to: optModel.email,
            subject: "Really Booking Verify Email Code",
            text: `Your Code is ${optModel.otp}`,
          };

          mailer.transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          res.status(200).send("The code has been sent to your email");
        });
      }
    })
    .catch(function (err1) {
      res.status(400).send(err1);
    });
};
updateIdentity = async (req, res, id) => {
  if (!req.body.imageId) {
    return res.status(400).send("imageId is required");
  }
  if (!req.body.imageIdBack && req.body.idType == "Id") {
    return res.status(400).send("imageIdBack is required");
  }
  let editObject = {
    ...req.body,
    verifyIdentityType: "Request",
  };
  userModel.defaultSchema
    .findByIdAndUpdate(
      id,
      { $set: editObject },
      {
        new: true,
        setDefaultsOnInsert: true,
      }
    )
    .then(function (user) {
      let request = {
        details: "أريد تحديث البطاقةالشخصية",
        type: "Identify",
        target: "User",
        userId: user._id,
      };
      requestModel.defaultSchema
        .create(request)
        .then(function (_request) {
          // webSocket.sendAdminMessage(_request);
          res.status(200).send(user);
        })
        .catch(function (err) {
          res.status(400).send(err);
        });
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};
changeEmail = async (req, res, id) => {
  if (!req.body.email) {
    return res.status(400).send("email is required");
  }

  let editObject = {
    email: req.body.email,
    emailVerify: false,
  };
  userModel.defaultSchema
    .findByIdAndUpdate(
      id,
      { $set: editObject },
      {
        new: true,
        setDefaultsOnInsert: true,
      }
    )
    .then(function (data) {
      res.status(200).send(data);
      let optModel = {
        otp: Math.floor(Math.random() * 90000) + 10000,
        email: req.body.email,
      };
      userOptModel.defaultSchema.create(optModel).then(function (models1) {
        let mailOptions = {
          from: process.env.GMAILUSER,
          to: optModel.email,
          subject: "Really Booking Verify Email Code",
          text: `Your Code is ${optModel.otp}`,
        };

        mailer.transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      });
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};
createUser = async (req, res) => {
  if (!req.body.idType && req.body.role != "Renter") {
    return res.status(400).send("idType is required");
  }
  if (!req.body.imageId && req.body.role != "Renter") {
    return res.status(400).send("imageId is required");
  }

  if (
    !req.body.imageIdBack &&
    req.body.role != "Renter" &&
    req.body.idType == "Id"
  ) {
    return res.status(400).send("imageIdBack is required");
  }
  if (req.body.idType == "Id" && req.body.imageId && !req.body.imageIdBack) {
    return res.status(400).send("imageIdBack is required");
  }
  if (req.body.imageId && req.body.idType) {
    req.body.verifyIdentityType = "Request";
  } else {
    req.body.verifyIdentityType = "Empty";
  }
  if (!req.body.phone) {
    return res.status(400).send("Phone is required");
  }
  let optModel = {
    otp: Math.floor(Math.random() * 90000) + 10000,
    email: req.body.email,
  };
  req.body.emailVerify = false;
  userModel.defaultSchema
    .create(req.body)
    .then(function (user) {
      userOptModel.defaultSchema
        .create(optModel)
        .then(function (models1) {
          let mailOptions = {
            from: process.env.GMAILUSER,
            to: optModel.email,
            subject: "Really Booking Verify Email Code",
            text: `Your Code is ${optModel.otp}`,
          };

          mailer.transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          let request = {
            details: "أريد تحديث البطاقةالشخصية",
            type: "Identify",
            target: "User",
            userId: user._id,
          };
          requestModel.defaultSchema
            .create(request)
            .then(function (_request) {
              // webSocket.sendAdminMessage(_request);

              res.status(200).send(user);
            })
            .catch(function (err) {
              res.status(400).send(err);
            });
        })
        .catch(function (err) {
          res.status(400).send(err);
        });
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};
module.exports = {
  deleteUser: userModel.genericSchema.delete,
  updateUser: userModel.genericSchema.update,
  findById: userModel.genericSchema.findById,
  createSocialMedia: userModel.genericSchema.create,
  create: createUser,
  findAll: findAllUsers,
  verifyEmail,
  generatOptEmail,
  getOptEmail,
  forgetPassword,
  updateIdentity,
  changeEmail,
  findUserAccount: findUser,
  addPurchaseIntoUser,
  findUserCourses,
  findUserLessons,
  addFavoriteIntoUser,
  findUserFavorites,
  updateUserLessonPurchase,
  checkUserCourseInFavorite,
  findUserById,
  findUserByEmail,
  changePassword,
  removeUserFavorite,
  socialMediaLogin,
  addPromoIntoUser,
};
