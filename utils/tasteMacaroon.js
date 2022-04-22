const macaroon = require("macaroon");

module.exports = (req, res, next) => {
  try {
    // mac is in hex format
    const mac = req.headers.macaroon;
    const encType = req.headers.encodingtype
      ? req.headers.encodingtype
      : "base64";
    let veraccessmcrn;
    if (encType === "hex") {
      const base64Macaroon = Buffer.from(mac, "hex").toString("base64");
      const bytesMacaroon = macaroon.base64ToBytes(base64Macaroon);
      veraccessmcrn = macaroon.importMacaroon(bytesMacaroon);
    } else {
      const base64macaroon = macaroon.base64ToBytes(mac);
      veraccessmcrn = macaroon.importMacaroon(base64macaroon);
    }
    veraccessmcrn.verify(verRootkey, () => null, []);
    next();
  } catch (error) {
    res.status(401).json({
      message: "Authentication Failed!",
      error: "Bad Macaroon!",
    });
  }
};
