const router = require("express").Router();
const getinfoController = require("../controllers/getinfo");
const tasteMacaroon = require("../utils/tasteMacaroon");

//Get the basic information from the node
router.get("/", tasteMacaroon, getinfoController.getinfo);

//Creates a signature of the message with the node's secret key
router.post("/signMessage/", tasteMacaroon, getinfoController.signMessage);

//Check a signature is from a node
router.get(
  "/checkMessage/:message/:zbase",
  tasteMacaroon,
  getinfoController.checkMessage
);

//Decode an invoice string
router.get("/decode/:invoiceString", tasteMacaroon, getinfoController.decode);

//List configuration options
router.get('/listConfigs/', tasteMacaroon, getinfoController.listConfigs);

module.exports  = router;
