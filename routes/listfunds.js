const router = require("express").Router();
const listFundsController = require("../controllers/listfunds");
const tasteMacaroon = require("../utils/tasteMacaroon");

//Get on-chain and Channel fund information
router.get("/", tasteMacaroon, listFundsController.listFunds);

module.exports = router;
