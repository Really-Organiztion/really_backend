const teacherModel = require("../models/teacher.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const handleFiles = require("../../helpers/handleFiles");
const attachmentPath = require("../../helpers/attachmentPath.json");
const path = attachmentPath.attachments.teacherAttachmentPath;

findTeacher = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let teacher = await teacherModel.defaultSchema.findOne({ email });
  if (!teacher) res.status(400).send("Invalid email or password");
  else {
    const validPassword = await bcrypt.compare(password, teacher.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
    else {
      const ONE_WEEK = 604800;
      //Generating the token
      const token = jwt.sign(
        {
          id: teacher._id,
        },
        process.env.SECRET,
        {
          expiresIn: ONE_WEEK,
        }
      );
      let newTeacher = { password, ...teacher };
      delete newTeacher._doc.password;
      return res.status(200).send({
        success: true,
        message: "You can login now",
        teacher: newTeacher._doc,
        token,
      });
    }
  }
};
socialMediaLogin = async (req, res) => {
  const email = req.body.email;
  teacherModel.defaultSchema.findOneAndUpdate(
    { email },
    { $set: { socialMediaToken: req.body.socialMediaToken } },
    {
      // While Update: show last updated document with new values
      new: true,
      // While Update: the default values will inserted without passing values explicitly
      setDefaultsOnInsert: true,
    },
    function (err, teacher) {
      if (err) res.status(500).send(err);
      else {
        if (!teacher) res.status(400).send("Invalid email");
        else {
          const ONE_WEEK = 604800;
          //Generating the token
          const token = jwt.sign(
            {
              id: teacher._id,
            },
            process.env.SECRET,
            {
              expiresIn: ONE_WEEK,
            }
          );
          let newTeacher = { ...teacher };
          delete newTeacher._doc.password;
          return res.status(200).send({
            success: true,
            message: "You can login now",
            teacher: newTeacher._doc,
            token,
          });
        }
      }
    }
  );
};
findAllTeachers = async (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  let teachers = await teacherModel.defaultSchema
    .find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .select({ password: 0, __v: 0 })
    .sort({ date: -1 });
  if (!teachers) res.status(500).send("No Teachers Found");
  else return res.status(200).send(teachers);
};
findAllApprovedTeachers = async (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  let teachers = await teacherModel.defaultSchema
    .find({ approved: true })
    .select({ password: 0, __v: 0 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ date: -1 });
  if (!teachers) res.status(500).send("No Teachers Found");
  else return res.status(200).send(teachers);
};
createTeacher = async (req, res) => {
  try {
    req.body.frontIdCard = await handleFiles.saveFiles(
      req.body.frontIdCard,
      "FrontIdCard",
      path
    );
    req.body.backIdCard = await handleFiles.saveFiles(
      req.body.backIdCard,
      "BackIdCard",
      path
    );
    req.body.personalImage = await handleFiles.saveFiles(
      req.body.personalImage,
      "PersonalImage",
      path
    );
    const allCertificates = [];
    for (const certificate of req.body.certificates) {
      const result = await handleFiles.saveFiles(
        certificate,
        "Certificate",
        path
      );
      allCertificates.push(result);
    }
    req.body.certificates = allCertificates;
    Promise.all([
      req.body.frontIdCard,
      req.body.backIdCard,
      req.body.personalImage,
      req.body.certificates,
    ])
      .then((values) => {
        req.body.bio = `${req.body.firstName} ${req.body.lastName} - ${req.body.specialization}`;
        teacherModel.defaultSchema.create(req.body, function (err, data) {
          if (err) res.status(500).send(err);
          else res.status(201).send(req.body);
        });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (err) {
    console.log("err", err);
    return res.status(500).send(err);
  }
};
updateTeacherPersonalImage = async (req, res, id) => {
  if (req.body.toDelete) {
    handleFiles.deleteFile(req.body.toDelete, path);
  }
  if (req.body.attachment) {
    try {
      req.body.attachment = await handleFiles.saveFiles(
        req.body.attachment,
        "personalImage",
        path
      );
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  teacherModel.defaultSchema.findByIdAndUpdate(
    id,
    { $set: { personalImage: req.body.attachment } },
    {
      // While Update: show last updated document with new values
      new: true,
      // While Update: the default values will inserted without passing values explicitly
      setDefaultsOnInsert: true,
    },
    function (err, data) {
      if (err) res.status(500).send(err);
      else if (data === null) res.status(404).send("ID is not found");
      else res.status(200).send(data);
    }
  );
};
changePassword = async (req, res, id) => {
  let teacher = await teacherModel.defaultSchema.findOne({ _id: id });
  if (!teacher) res.status(400).send("Invalid data");
  else {
    const validPassword = await bcrypt.compare(
      req.body.oldPassword,
      teacher.password
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
          teacherModel.defaultSchema.findByIdAndUpdate(
            id,
            { $set: { password: req.body.newPassword } },
            {
              // While Update: show last updated document with new values
              new: true,
              // While Update: the default values will inserted without passing values explicitly
              setDefaultsOnInsert: true,
            },
            function (err, data) {
              if (err) res.status(500).send(err);
              else if (data === null) res.status(404).send("ID is not found");
              else res.status(200).send(data);
            }
          );
        });
      });
    }
  }
};
updateTeacherStatus = async (req, res, id) => {
  teacherModel.defaultSchema.findByIdAndUpdate(
    id,
    { $set: { approved: req.body.approved } },
    {
      // While Update: show last updated document with new values
      new: true,
      // While Update: the default values will inserted without passing values explicitly
      setDefaultsOnInsert: true,
    },
    function (err, data) {
      if (err) res.status(500).send(err);
      else if (data === null) res.status(404).send("ID is not found");
      else res.status(200).send(data);
    }
  );
};
findTeacherById = (id) => {
  return new Promise(async (resolve, reject) => {
    const teacher = await teacherModel.defaultSchema.findById(id);
    if (teacher) resolve(teacher);
    else reject(teacher);
  });
};
module.exports = {
  deleteTeacher: teacherModel.genericSchema.delete,
  updateTeacher: teacherModel.genericSchema.update,
  findById: teacherModel.genericSchema.findById,
  create: createTeacher,
  findAll: findAllTeachers,
  findTeacherAccount: findTeacher,
  findAllApprovedTeachers,
  updateTeacherPersonalImage,
  changePassword,
  updateTeacherStatus,
  findTeacherById,
  socialMediaLogin,
};
