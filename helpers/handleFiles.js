const fs = require("fs");
const mkdirp = require("mkdirp").mkdirp;
const multer = require("multer");
const validPathesNames = ["user", "unit"];
const validFilesTypes = ["image", "file", "video"];

const handleFileUpload = (req, res) => {
  if (!validPathesNames.includes(req.params.pathName)) {
    return res.status(400).send("The pathName is incorrect");
  }
  if (!validFilesTypes.includes(req.params.fileType)) {
    return res.status(400).send("The fileType is incorrect");
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `attachments/${req.params.pathName}/${req.params.fileType}/`);
    },
    filename: function (req, file, cb) {
      const unqieName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unqieName + "-" + file.originalname);
    },
  });
  const upload = multer({ storage: storage });
  upload.single("file")(req, res, function (err) {
    if (err) {
      return res.status(400).send(err, "Error uploading file");
    }

    if (req.file) {
      // Store the file path in the request object
      return res.status(200).send({
        url: req.file.destination + req.file.filename,
        path: req.file.path,
        size: req.file.size,
      });
    } else {
      return res.status(400).send("Error uploading file");
    }

    // Call the next middleware
  });
};

saveFiles = (file, type, path) => {
  return new Promise((resolve, reject) => {
    const fileType = file.split(",")[0];
    const fileSize =
      Math.round(((file.length - fileType.length) * 3) / 4) / 1024 / 1024;
    if (fileSize <= 5) {
      const data = file.replace(/^data:([A-Za-z-+\/]+);base64,/, "");
      let mimeType = file.split(";")[0].split("/")[1];
      const filePath = "./" + path + type + Date.now() + "." + mimeType;
      // returnedPath = `${filePath},${fileType}`;
      const returnedPath = filePath.replace("./" + path, "");
      mkdirp(path).then((made) => {
        fs.writeFile(filePath, data, { encoding: "base64" }, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(returnedPath);
          }
        });
      });
    } else {
      return reject("File size should not be more than 5 MB");
    }
  });
};
deleteFile = (file, attachmentPath) => {
  return new Promise((resolve, reject) => {
    const path = `${attachmentPath}/${file}`;
    fs.unlink(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

readFile = async (key) => {
  firstPart = key.split(",")[0];
  secondPart = key.split(",")[1];
  const res = await fs.readFileSync(firstPart, {
    encoding: "base64",
  });
  const result = `${secondPart},${res}`;
  return result;
};

module.exports = {
  handleFileUpload,
  saveFiles,
  readFile,
  deleteFile,
};
