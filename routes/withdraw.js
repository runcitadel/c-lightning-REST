const router = require("express").Router();
const withdrawController = require("../controllers/withdraw");
const tasteMacaroon = require("../utils/tasteMacaroon");

//Withdraw funds on-chain
router.post("/", tasteMacaroon, withdrawController.withdraw);

module.exports = router;
