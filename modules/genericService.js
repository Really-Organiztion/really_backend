const handleFiles = require("../helpers/handleFiles");

module.exports = function (Collection) {
  let db = {};
  db.findAll = (req, res) => {
    const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    let where = {};
    if (req.body.isDeleted) {
      where["isDeleted"] = true;
    } else {
      where["isDeleted"] = false;
    }
    Collection.find(where)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec((err, data) => res.send(err || data));
  };

  db.create = (req, res) => {
    Collection.create(req.body)
      .then(function (_obj) {
        res.status(201).send(_obj);
      })
      .catch(function (err) {
        res.status(400).send(err);
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
      if (err) res.status(400).send(err);
      else res.status(201).send(req.body);
    });
  };

  db.findById = (req, res, id) => {
    Collection.findById(id)
      .then(function (data) {
        res.status(200).send(data);
      })
      .catch(function (err) {
        res.status(400).send(err);
      });
  };

  db.update = (req, res, id) => {
    Collection.findByIdAndUpdate(id, req.body, {
      new: true,
      setDefaultsOnInsert: true,
    })
      .then(function (data) {
        res.status(200).send(data);
      })
      .catch(function (err) {
        res.status(400).send(err);
      });
  };

  db.delete = (req, res, id) => {
    Collection.findByIdAndUpdate(id, {
      isDeleted: true,
    })
      .then(function (models) {
        res.status(200).send("Deleted is done");
      })
      .catch(function (err) {
        res.status(400).send(err);
      });
  };
  db.deleteReturn = (req, res, id) => {
    Collection.findByIdAndUpdate(id, {
      isDeleted: false,
    })
      .then(function (models) {
        res.status(200).send("Deleted Returned is done");
      })
      .catch(function (err) {
        res.status(400).send(err);
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
        if (err) res.status(400).send(err);
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
        if (err) res.status(400).send(err);
        else
          Collection.countDocuments(convertedValues, (err, count) => {
            if (err) res.status(400).send(err);
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
