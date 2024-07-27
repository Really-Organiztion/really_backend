const jwt = require("jwt-simple");
const adminController = require("../modules/controllers/admin.controller");
const userController = require("../modules/controllers/user.controller");

const getToken = (headers) => {
  if (headers && headers.authorization) {
    let parted = headers.authorization.split("Bearer ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const logOut = async (req, res) => {
  try {
    res.clearCookie("jwt_token");
    req.session.destroy();
    // await   jwt.destroy(getToken(req.headers), process.env.SECRET);
    res.status(200).send("User logout is susses");
  } catch (err) {
    res.status(400).send("Token Not Correct");
  }
};

const getDecodedToken = (headers) => {
  try {
    return jwt.decode(getToken(headers), process.env.SECRET);
  } catch (ex) {
    return null;
  }
};

const isAuthenticatedAsUser = async (req, res, next) => {
  const decodedData = getDecodedToken(req.headers);
  if (decodedData) {
    let result = await userController.findUserById(decodedData.id);
    if (result) next();
    else res.status(400).send('Must Be User');
  } else res.status(400).send('Token Not Correct');
};

const isAuthenticatedAsAdmin = async (req, res, next) => {
  const decodedData = getDecodedToken(req.headers);
  if (decodedData) {
    let result = await adminController.findAdminById(decodedData.id);
    if (result) next();
    else res.status(400).send('Must Be Admin');
  } else res.status(400).send('Token Not Correct');
};

module.exports = {
  logOut,
  getToken,
  getDecodedToken,
  isAuthenticatedAsAdmin,
  isAuthenticatedAsUser,
};
