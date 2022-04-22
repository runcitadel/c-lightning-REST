//This controller houses all the fee functions

//Function # 1
//Invoke the 'getinfo' command to query the routing fee earned
//Arguments - No arguments
/**
 * @swagger
 * /getFees:
 *   get:
 *     tags:
 *       - General Information
 *     name: getfees
 *     summary: Gets the routing fee collected by the node
 *     responses:
 *       200:
 *         description: routing fee returned successfully
 *         schema:
 *           type: object
 *           properties:
 *             feeCollected:
 *               type: integer
 *               description: feeCollected
 *       500:
 *         description: Server error
 */
exports.getFees = (req, res) => {
  function connFailed(err) {
    throw err;
  }
  ln.on("error", connFailed);

  //Call the getinfo command
  ln.getinfo()
    .then((data) => {
      const feeData = {
        feeCollected: data.msatoshi_fees_collected,
      };
      global.logger.log("getFees success");
      res.status(200).json(feeData);
    })
    .catch((err) => {
      global.logger.warn(err);
      res.status(500).json({ error: err });
    });
  ln.removeListener("error", connFailed);
};
