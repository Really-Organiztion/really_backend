const adminModel = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config/default.json");

findAdmin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let admin = await adminModel.defaultSchema.findOne({ username });
  if (!admin) res.status(400).send("Invalid username or password")
  else if(admin.isDeleted)res.status(400).send("Admin is deleted")
  else {
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword)
      return res.status(400).send("Invalid username or password");
    else {
      const ONE_WEEK = 604800;
      //Generating the token
      const token = jwt.sign(
        {
          id: admin._id,
        },
        process.env.SECRET,
        {
          expiresIn: ONE_WEEK,
        }
      );
      //identity Is Valid
      //This object is just used to remove the password from the retuned fields
      let returnIdentity = {
        username,
        id: admin._id,
        role : admin.role,
      };
      //Send the response back
      return res.status(200).send({
        success: true,
        message: "You can login now",
        admin: returnIdentity,
        token,
      });
    }
  }
};
findAllAdmins = async (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  let where = {};
  if(req.body && req.body.isDeleted) {
    where['isDeleted'] = true
  } else {
    where['isDeleted'] = false
  }
  let admins = await adminModel.defaultSchema
    .find(where)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .select({ password: 0, __v: 0 });
  if (!admins) res.status(400).send("No Admins Found");
  else return res.status(200).send(admins);
};
function loginAsSuperAdmin(username, callback) {
  callback = callback || {};
  adminModel.defaultSchema
    .findOne({username})
    .then(function (obj) {
      callback( null,obj );
    })
    .catch(function (err) {
      callback( err,null );
    });
}
 
function createSuperAdmin(callback) {
  callback = callback || {};
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return callback(err);
    bcrypt.hash(config.superAdmin.password, salt, (err, hash) => {
      if (err) callback(err);
      let body = {
        username: config.superAdmin.username,
        password: hash,
        role : config.superAdmin.role,
      };
      adminModel.defaultSchema.create(body)
      .then(function (obj) {
        callback({ obj });
      })
      .catch(function (err) {
        callback({ err });
      });
    });
  });
}
updateAdminRole =  (req, res, id) => {
  adminModel.defaultSchema
    .findOneAndUpdate(
      {
        _id: id,
      },
      { $set: { role: req.body.role } },
      {
        new: true,
      }
    )
    .then(function () {
      res.status(201).send('Role update is done')
    })
    .catch(function (err) {
      res.status(400).send(err)
    });
};
changePassword = async (req, res, id) => {
  let user = await adminModel.defaultSchema.findOne({ _id: id });
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
          adminModel.defaultSchema.findByIdAndUpdate(
            id,
            { $set: { password: req.body.newPassword } },
            {
              new: true,
              setDefaultsOnInsert: true,
            }
          ).then(function (models) {
            res.status(200).send("Updated password is done");
          })
          .catch(function (err) {
            res.status(400).send(err);
          });
        });
      });
    }
  }
};
findAdminById = (id) => {
  return new Promise(async (resolve, reject) => {
    const admin = await adminModel.defaultSchema.findById(id);
    if (admin) resolve(admin);
    else reject(admin);
  });
};
module.exports = {
  deleteAdmin: adminModel.genericSchema.delete,
  updateAdmin: adminModel.genericSchema.update,
  updateAdminRole: updateAdminRole,
  findById: adminModel.genericSchema.findById,
  create: adminModel.genericSchema.create,
  findAll: findAllAdmins,
  findAdminAccount: findAdmin,
  loginAsSuperAdmin,
  createSuperAdmin,
  changePassword,
  findAdminById,
};
