const router = require("express").Router();
const datastoreController = require("../controllers/datastore");
const tasteMacaroon = require("../utils/tasteMacaroon");

//Store data
router.post("/", tasteMacaroon, datastoreController.dataStore);

//List data
router.get("/listDatastore/", tasteMacaroon, datastoreController.listDatastore);

//Delete data
router.delete(
  "/delDatastore/:key",
  tasteMacaroon,
  datastoreController.delDatastore
);

module.exports = router;
