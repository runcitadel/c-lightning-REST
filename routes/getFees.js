const router = require("express").Router();
const getFeeController = require("../controllers/getFees");
const tasteMacaroon = require("../utils/tasteMacaroon");

//Get the routing fee collected by the node
router.get("/", tasteMacaroon, getFeeController.getFees);

module.exports = router;
