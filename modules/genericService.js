const handleFiles = require("../helpers/handleFiles");

module.exports = function (Collection) {
  let db = {};
  db.findAll = (req, res) => {
    const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    Collection.find({})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec((err, data) => res.send(err || data));
  };

  db.create = (req, res) => {
    Collection.create(req.body, function (err, cat) {
      if (err) res.status(500).send(err);
      else res.status(201).send(req.body);
    });
  };

  db.createWithAttachment = async (req, res, path) => {
    if (req.body.attachment) {
      req.body.attachment = await handleFiles.saveFiles(
        req.body.attachment,
        "Attachment",
        path
      );
    }
    Collection.create(req.body, function (err, cat) {
      if (err) res.status(500).send(err);
      else res.status(201).send(req.body);
    });
  };

  db.findById = (req, res, id) => {
    Collection.findById(id, function (err, data) {
      if (err) res.status(500).send(err);
      else res.status(200).send(data);
    });
  };

  db.update = (req, res, id) => {
    Collection.findByIdAndUpdate(
      id,
      req.body,
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

  db.delete = (req, res, id) => {
    Collection.findByIdAndRemove(id, function (err, data) {
      if (err) res.status(500).send(err);
      else {
        if (data === null) res.sendStatus(404);
        else res.sendStatus(200);
      }
    });
  };
  db.deActivate = (req, res, id) => {
    req.body.isActive = false;
    Collection.findByIdAndUpdate(
      id,
      {
        isActive: req.body.isActive,
      },
      function (err, result) {
        if (err) res.status(500).send(err);
        else res.status(200).send(req.body.isActive);
      }
    );
  };

  db.search = (req, res) => {
    // TODO: make it configurable
    let pageLimit = 5;

    sort = req.query.sort
      ? { [req.query.sort]: req.query[req.query.sort] === "asc" ? 1 : -1 }
      : {};

    convertedValues = {};
    for (let key in req.body) {
      convertedValues[key] = RegExp(req.body[key], "ig");
    }

    Collection.find(
      convertedValues,
      {},
      {
        limit: pageLimit,
        skip: pageLimit * parseInt((req.query.page || 1) - 1),
        sort: sort,
      },
      function (err, results) {
        if (err) res.status(500).send(err);
        else
          Collection.countDocuments(convertedValues, (err, count) => {
            if (err) res.status(500).send(err);
            else
              res.send({
                count,
                pages: Math.ceil(count / pageLimit),
                results,
              });
          });
      }
    );
  };

  return db;
};
