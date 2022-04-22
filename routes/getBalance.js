const router = require("express").Router();
const getBalanceController = require("../controllers/getBalance");
const tasteMacaroon = require("../utils/tasteMacaroon");

//Get the Total, Confirmed and Unconfirmed on-chain balance
router.get("/", tasteMacaroon, getBalanceController.getBalance);

module.exports = router;
