const unitModel = require("../models/unit.model");
const requestModel = require("../models/request.model");
const webSocket = require("../../helpers/websocket");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const crypto = require("crypto");
const puppeteer = require("puppeteer");

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let where = req.body || {};
  if (req.body) {
    if (req.body.isDeleted) {
      where = { isDeleted: true };
    } else {
      where = { isDeleted: false };
    }
    if (req.body.status) {
      where["status"] = req.body.status;
    }
    if (req.body.userId) {
      where["userId"] = new ObjectId(req.body.userId);
    }
    if (req.body.unitId) {
      where["parentsId"] = new ObjectId(req.body.unitId);
    }
    if (req.body.countryId) {
      where["countryId"] = new ObjectId(req.body.countryId);
    }
    if (req.body.linkedByUserId) {
      where["linkedBy.userId"] = new ObjectId(req.body.linkedByUserId);
    }
  } else {
    where = { isDeleted: false };
  }

  if (where["search"]) {
    where.$or = [
      // { name: { $regex: where["search"], $options: "i" } },
      // { nameAr: { $regex: where["search"], $options: "i" } },
      { targetType: { $regex: where["search"], $options: "i" } },
      { area: { $regex: where["search"], $options: "i" } },
      { address: { $regex: where["search"], $options: "i" } },
      { type: { $regex: where["search"], $options: "i" } },
      { gLocationLink: { $regex: where["search"], $options: "i" } },
      { additionsServices: { $regex: where["search"], $options: "i" } },
    ];
    delete where["search"];
  }

  unitModel.defaultSchema
    .find(where)
    .sort({ _id: -1 })
    .populate("countryId", [`${toFound}`, "code", "numericCode"])
    .populate("userId", [
      "firstName",
      "lastName",
      "gender",
      "phone",
      "profileImage",
    ])
    .populate("linkedBy.userId", [
      "firstName",
      "lastName",
      "gender",
      "phone",
      "profileImage",
    ])
    // .populate("servicesId", [`${toFound}`, "subServicesList"])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

findAllFilterCb = (req, res) => {
  return new Promise((resolve, reject) => {
    let where = {};
    if (req.body) {
      if (req.body.isDeleted) {
        where = { isDeleted: true };
      } else {
        where = { isDeleted: false };
      }
      if (req.body.isTrusted) {
        where["isTrusted"] = true;
      }
      if (req.body.isSeparated) {
        where["isSeparated"] = true;
      }
      if (req.body.targetType) {
        where["targetType"] = req.body.targetType;
      }
    }
    if (req.body.search) {
      where.$or = [
        // { name: { $regex: req.body.search, $options: "i" } },
        // { nameAr: { $regex: req.body.search, $options: "i" } },
        { address: { $regex: req.body.search, $options: "i" } },
        { additionsServices: { $regex: req.body.search, $options: "i" } },
      ];
    }

    unitModel.defaultSchema
      .find(where, { _id: 1 })
      .populate("linkedBy.userId", [
        "firstName",
        "lastName",
        "gender",
        "phone",
        "profileImage",
      ])

      // .populate("servicesId", [`${toFound}`, "subServicesList"])
      .then(function (data) {
        resolve(data);
      })
      .catch(function (err) {
        reject(null);
      });
  });
};

updateUnitCb = (obj, where) => {
  return new Promise((resolve, reject) => {
    unitModel.defaultSchema
      .findOneAndUpdate(where, obj)
      .then(function (res) {
        resolve(res);
      })
      .catch(function (err) {
        reject(null);
      });
  });
};

create = async (req, res) => {
  if (req.body.location && req.body.location.coordinates) {
    req.body.location.coordinates = [req.body.location.coordinates];
  }

  unitModel.defaultSchema
    .create(req.body)
    .then(function (doc) {
      let request = {
        name: "I want to add new unit",
        nameAr: "أريد إضافة وحدة جدبدة",
        code: crypto.randomBytes(6).toString("hex"),
        type: "AddUnit",
        target: "Unit",
        userId: doc.userId,
        unitId: doc._id,
      };

      requestModel.defaultSchema
        .create(request)
        .then(function (_request) {
          webSocket.sendAdminMessage(_request, res);
          res.status(200).send(doc);
        })
        .catch(function (err) {
          res.status(400).send(err);
        });
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};



const extractLatLngFromLink = (link) => {
  const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = link.match(regex);
  if (match) {
    return [parseFloat(match[2]), parseFloat(match[1])];
  }

  const altRegex = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
  const altMatch = link.match(altRegex);
  if (altMatch) {
    return [parseFloat(altMatch[2]), parseFloat(altMatch[1])];
  }

  return null;
};

const extractLatLngWithPuppeteer = async (link) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(link, { waitUntil: "networkidle2", timeout: 60000 });

    const finalUrl = page.url();
    console.log("🔗 Final Puppeteer URL:", finalUrl);

    // أولوية 1: من URL
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = finalUrl.match(regex);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      console.log("✅ Extracted from URL:", [lng, lat]);
      await browser.close();
      return [lng, lat];
    }

    // أولوية 2: من meta tag
    const metaContent = await page
      .$eval('meta[property="og:description"]', el => el.content)
      .catch(() => null);
    if (metaContent) {
      const metaMatch = metaContent.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
      if (metaMatch) {
        const lat = parseFloat(metaMatch[1]);
        const lng = parseFloat(metaMatch[2]);
        console.log("✅ Extracted from meta tag:", [lng, lat]);
        await browser.close();
        return [lng, lat];
      }
    }

    console.warn("⚠️ Coordinates not found from URL or Meta.");
    await browser.close();
    return null;

  } catch (err) {
    console.error("❌ Error extracting coordinates:", err.message);
    return null;
  }
};

const findCoordinatesMatch = async (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";

  let geoQuery = {};

  if (req.body.coordinates && Array.isArray(req.body.coordinates)) {
    geoQuery = {
      location: {
        $geoIntersects: {
          $geometry: {
            type: "Polygon",
            coordinates: [req.body.coordinates],
          },
        },
      },
    };
  } else if (req.body.gLocationLink) {
    let point = extractLatLngFromLink(req.body.gLocationLink);
    console.log("📌 Link-extracted point:", point);

    if (!point && req.body.gLocationLink.includes("maps.app.goo.gl")) {
      point = await extractLatLngWithPuppeteer(req.body.gLocationLink);
    }

    console.log("📌 Final used point:", point);

    if (point) {
      geoQuery = {
        location: {
          $geoIntersects: {
            $geometry: {
              type: "Point",
              coordinates: point,
            },
          },
        },
      };
    } else {
      return res.status(400).send({ error: "Invalid location link format" });
    }
  } else {
    return res.status(400).send({ error: "No coordinates or location link provided" });
  }

  try {
    const units = await unitModel.defaultSchema
      .find(geoQuery)
      .sort({ _id: -1 })
      .populate("countryId", [`${toFound}`, "code", "numericCode"])
      .populate("userId", ["firstName", "lastName", "gender", "phone", "profileImage"])
      .populate("linkedBy.userId", ["firstName", "lastName", "gender", "phone", "profileImage"])
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.status(200).send(units);
  } catch (err) {
    console.error("❌ Error querying DB:", err.message);
    res.status(400).send(err);
  }
};



findNearUnitsToPosts = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  const toFoundTitle = lang === "en" ? "title" : "titleAr";
  const toFoundDescription = lang === "en" ? "description" : "descriptionAr";
  //   .find(
  //     {
  //     location: {
  //       $near: {
  //         $geometry: { type: "Point", coordinates: req.body.coordinates },
  //         $maxDistance: req.body.distance,
  //       },
  //     },
  //   }
  // )
  // {
  //   $match: {
  //     location: {
  //       $near: {
  //         $geometry: { type: "Point", coordinates: req.body.coordinates },
  //         $maxDistance: req.body.distance,
  //       },
  //     },
  //   },
  // },

  unitModel.defaultSchema
    .aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: req.body.coordinates },
          spherical: true,
          maxDistance: req.body.distance,
          distanceField: "calcDistance",
        },
      },

      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "unitId",
          as: "post",
        },
      },
      {
        $unwind: {
          path: "$post",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          postId: { $first: `$post._id` },
          description: { $first: `$post.${toFoundDescription}` },
          title: { $first: `$post.${toFoundTitle}` },
          plansList: { $first: `$post.plansList` },
          status: { $first: `$post.status` },
          setting: { $first: `$post.setting` },
          target: { $first: `$post.target` },
          userId: { $first: `$post.userId` },
          unitId: { $first: `$post.unitId` },
          address: { $first: `$address` },
          type: { $first: `$type` },
          has3DView: { $first: `$has3DView` },
          imagesList: { $first: `$imagesList` },
          rate: { $first: `$rate` },
          isTrusted: { $first: `$isTrusted` },
          primImage: { $first: `$primImage` },
          isSeparated: { $first: `$isSeparated` },
          firstName: { $first: `$user.firstName` },
          lastName: { $first: `$user.lastName` },
          gender: { $first: `$user.gender` },
          profileImage: { $first: `$user.profileImage` },
          phone: { $first: `$user.phone` },
          role: { $first: `$user.role` },
          // phone: { $first: `$user.phone` },
          // phonesList: { $first: `$user.phonesList` },
        },
      },
      {
        $match: {
          postId: { $ne: null },
        },
      },
    ])
    .sort({ _id: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then(function (unit) {
      res.status(200).send(unit);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

findNearUnits = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  unitModel.defaultSchema
    .find(
      // { location : { $near : req.body.coordinates, $maxDistance: 5510 } }
      {
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: req.body.coordinates },
            $maxDistance: req.body.distance,
          },
        },
      }
    )
    .sort({ _id: -1 })
    .populate("countryId", [`${toFound}`, "code", "numericCode"])
    .populate("userId", [
      "firstName",
      "lastName",
      "gender",
      "phone",
      "profileImage",
    ])

    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then(function (unit) {
      res.status(200).send(unit);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

findById = (req, res, id) => {
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  unitModel.defaultSchema
    .findById(id)
    .populate("countryId", [`${toFound}`, "code", "numericCode"])
    .populate("userId", [
      "firstName",
      "lastName",
      "gender",
      "phone",
      "profileImage",
    ])
    .populate("linkedBy.userId", [
      "firstName",
      "lastName",
      "gender",
      "phone",
      "profileImage",
    ])
    // .populate("servicesId", [`${toFound}`, "subServicesList"])
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

updateUnit = async (req, res, id) => {
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  if (req.body.location && req.body.location.coordinates) {
    req.body.location.coordinates = [req.body.location.coordinates];
  }
  unitModel.defaultSchema
    .findByIdAndUpdate(id, req.body, {
      new: true,
      setDefaultsOnInsert: true,
    })
    .populate("countryId", [`${toFound}`, "code", "numericCode"])
    .populate("userId", [
      "firstName",
      "lastName",
      "gender",
      "phone",
      "profileImage",
    ])
    .populate("linkedBy.userId", [
      "firstName",
      "lastName",
      "gender",
      "phone",
      "profileImage",
    ])
    .then(function (data) {
      if (req.body.status === "UnderReview" && data && data.userId) {
        let request = {
          name: "I want to Update unit",
          nameAr: "أريد تعديل بيانات وحدة",
          code: crypto.randomBytes(6).toString("hex"),
          type: "UpdateUnit",
          target: "Unit",
          userId: data.userId._id,
          unitId: data._id,
        };

        requestModel.defaultSchema
          .create(request)
          .then(function (_request) {
            webSocket.sendAdminMessage(_request, res);
            res.status(200).send(data);
          })
          .catch(function (err1) {
            res.status(400).send(err1);
          });
      } else {
        res.status(200).send(data);
      }
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

const getCoordinates = async (shortUrl) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto(shortUrl, { waitUntil: "networkidle2", timeout: 60000 });

    const finalUrl = page.url();
    const match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

    if (match) {
      const latitude = parseFloat(match[1]);
      const longitude = parseFloat(match[2]);
      return { latitude, longitude };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error while getting coordinates:", err.message);
    return null;
  } finally {
    await browser.close();
  }
};

module.exports = {
  deleteUnit: unitModel.genericSchema.delete,
  updateUnit,
  findById,
  create,
  updateUnitCb,
  findAll,
  findAllFilterCb,
  findCoordinatesMatch,
  findNearUnits,
  findNearUnitsToPosts,
  getCoordinates,
};
