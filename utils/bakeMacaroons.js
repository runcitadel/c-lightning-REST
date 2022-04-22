const macaroon = require("macaroon");
const crypto = require("crypto");

exports.bakeMcrns = () => {
  try {
    const location = "c-lightning";
    const rootKey = crypto.randomBytes(64).toString("hex");
    const identifier = new Date().toString();

    //Generate Macaroon
    const accessMacaroon = macaroon.newMacaroon({
      identifier: identifier,
      location: location,
      rootKey: rootKey,
      version: 2,
    });

    return [rootKey, accessMacaroon.exportBinary()];
  } catch (error) {
    throw new Error(error);
  }
};
