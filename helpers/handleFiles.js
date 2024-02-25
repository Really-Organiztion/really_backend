const fs = require("fs");
const mkdirp = require("mkdirp");

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
  saveFiles,
  readFile,
  deleteFile,
};
