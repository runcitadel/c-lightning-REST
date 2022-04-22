const router = require("express").Router();
const rpcController = require("../controllers/rpc");
const tasteMacaroon = require("../utils/tasteMacaroon");

//Get the basic information from the node
router.post("/", tasteMacaroon, rpcController.rpc);

module.exports = router;
