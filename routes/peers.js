const router = require("express").Router();
const connectPeerController = require("../controllers/peers");
const tasteMacaroon = require("../utils/tasteMacaroon");

//Connect with a new network peer
router.post("/connect", tasteMacaroon, connectPeerController.connectPeer);

//List connect peers
router.get("/listPeers", tasteMacaroon, connectPeerController.listPeers);

//Disconnect from a network peer
router.delete(
  "/disconnect/:pubKey",
  tasteMacaroon,
  connectPeerController.disconnectPeer
);

module.exports = router;
