//This controller houses all the offers functions

//Function # 1
//Invoke the 'offer' command to setup an offer
//Arguments - Amount (required), Description (required)
/**
 * @swagger
 * /offers/offer:
 *   post:
 *     tags:
 *       - Offers
 *     name: offer
 *     summary: Creates an offer
 *     description: Core documentation - https://lightning.readthedocs.io/lightning-offer.7.html
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: amount
 *         description: Specify the amount as 'any' or '<amount>sats'. E.g. '75sats'
 *         type: string
 *         required:
 *           - amount
 *       - in: body
 *         name: description
 *         description: Description of the offer, to be included on the invoice
 *         type: string
 *         required:
 *           - description
 *       - in: body
 *         name: vendor
 *         description: Reflects who is issuing this offer
 *         type: string
 *       - in: body
 *         name: label
 *         description: Internal-use name for the offer, which can be any UTF-8 string
 *         type: string
 *       - in: body
 *         name: quantity_min
 *         description: The presence of quantity_min or quantity_max indicates that the invoice can specify more than one of the items within this (inclusive) range
 *         type: number
 *       - in: body
 *         name: quantity_max
 *         description: The presence of quantity_min or quantity_max indicates that the invoice can specify more than one of the items within this (inclusive) range
 *         type: number
 *       - in: body
 *         name: absolute_expiry
 *         description: The time the offer is valid until, in seconds since the first day of 1970 UTC
 *         type: string
 *       - in: body
 *         name: recurrence
 *         description: Means invoice  is  expected at regular intervals. The argument is a positive number followed by one of "seconds", "minutes", "hours", "days", "weeks", "months" or "years" e.g. "2weeks".
 *         type: string
 *       - in: body
 *         name: recurrence_base
 *         description: Time in seconds since the first day of 1970 UTC. This indicates when the first period begins. The "@" prefix means that the invoice must start by paying the first period e.g. "@1609459200"
 *         type: string
 *       - in: body
 *         name: recurrence_paywindow
 *         description: Optional argument of form start of a period in which an invoice and payment is valid
 *         type: string
 *       - in: body
 *         name: recurrence_limit
 *         description: Optional argument to indicate the maximum period which exists for recurrence e.g. "12" means there are 13 periods of recurrence
 *         type: string
 *       - in: body
 *         name: single_use
 *         description: Indicates that the offer is only valid once
 *         type: boolean
 *     responses:
 *       201:
 *         description: An offers object is returned
 *         schema:
 *           type: object
 *           properties:
 *             offer_id:
 *               type: string
 *               description: The hash of the offer
 *             active:
 *               type: string
 *               description: true if the offer is active
 *             single_use:
 *               type: boolean
 *               description: true if single use was specified for the offer
 *             bolt12:
 *               type: string
 *               description: The bolt12 offer, starting with "lno1"
 *             bolt12_unsigned:
 *               type: string
 *               description: The bolt12 encoding of the offer, without a signature
 *             used:
 *               type: boolean
 *               description: true if an associated invoice has been paid
 *             created:
 *               type: boolean
 *               description: false if the offer already existed
 *             label:
 *               type: string
 *               description: the (optional) user-specified label
 *       500:
 *         description: Server error
 */
exports.offer = (req, res) => {
  global.logger.log("offer creation initiated...");

  function connFailed(err) {
    throw err;
  }
  ln.on("error", connFailed);
  //Set required params
  const clnReq = { amount: req.body.amount, description: req.body.description };
  //Set optional params
  for (const property of [
    "vendor",
    "label",
    "quantity_min",
    "quantity_max",
    "absolute_expiry",
    "recurrence",
    "recurrence_base",
    "recurrence_paywindow",
    "recurrence_limit",
  ]) {
    if (typeof req.body[property] === "undefined")
      clnReq[property] = req.body[property];
  }
  const single_use = !(
    req.body.single_use === "0" ||
    req.body.single_use === "false" ||
    !req.body.single_use
  );

  //Call the fundchannel command with the pub key and amount specified
  ln.offer({
    ...clnReq,
    single_use,
  })
    .then((data) => {
      global.logger.log("offer creation success");
      res.status(201).json(data);
    })
    .catch((err) => {
      global.logger.warn(err);
      res.status(500).json({ error: err });
    });
  ln.removeListener("error", connFailed);
};

//Function # 2
//Invoke the 'listoffers' command get the list of offers for the node
//Arguments - No arguments
/**
 * @swagger
 * /offers/listOffers:
 *   get:
 *     tags:
 *       - Offers
 *     name: listoffers
 *     summary: Returns a list of offers on the node
 *     description: Core documentation - https://lightning.readthedocs.io/lightning-listoffers.7.html
 *     parameters:
 *       - in: query
 *         name: offer_id
 *         description: List offer with only the offer with offer_id (if it exists)
 *         type: string
 *       - in: query
 *         name: active_only
 *         description: If specified, only active offers are returned
 *         type: string
 *     responses:
 *       200:
 *         description: An array of offers is returned
 *         schema:
 *           type: object
 *           properties:
 *             offer_id:
 *               type: string
 *               description: The hash of the offer
 *             active:
 *               type: boolean
 *               description: true if the offer is active
 *             single_use:
 *               type: boolean
 *               description: true if single use was specified for the offer
 *             bolt12:
 *               type: string
 *               description: The bolt12 offer, starting with "lno1"
 *             bolt12_unsigned:
 *               type: string
 *               description: The bolt12 encoding of the offer, without signature
 *             used:
 *               type: boolean
 *               description: true if an associated invoice has been paid
 *             label:
 *               type: string
 *               description: The optional user specified label
 *       500:
 *         description: Server error
 */
exports.listOffers = (req, res) => {
  function connFailed(err) {
    throw err;
  }
  ln.on("error", connFailed);

  //Set optional params
  const offrid = req.query.offer_id ? req.query.offer_id : null;
  const actvonly = !(
    req.query.active_only === "0" ||
    req.query.active_only === "false" ||
    !req.query.active_only
  );

  //Call the listoffers command
  ln.listoffers({
    ...(offrid ? { offer_id: offrid } : {}),
    active_only: actvonly,
  })
    .then((data) => {
      global.logger.log("listOffers success");
      res.status(200).json(data);
    })
    .catch((err) => {
      global.logger.warn(err);
      res.status(500).json({ error: err });
    });
  ln.removeListener("error", connFailed);
};

//This controller houses all the offers functions

//Function # 3
//Invoke the 'fetchinvoice' command to fetch an invoice for an offer
//Arguments - Offer (required), Amount (optional)
/**
 * @swagger
 * /offers/fetchInvoice:
 *   post:
 *     tags:
 *       - Offers
 *     name: fetchInvoice
 *     summary: Fetch an invoice for an offer
 *     description: Core documentation - https://lightning.readthedocs.io/lightning-fetchinvoice.7.html
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: offer
 *         description: Bolt12 offer string beginning with "lno1"
 *         type: string
 *         required:
 *           - offer
 *       - in: body
 *         name: msatoshi
 *         description: Required only if the offer does not specify an amount at all
 *         type: string
 *       - in: body
 *         name: quantity
 *         description: Required if the offer specifies quantity_min or quantity_max, otherwise it is not allowed
 *         type: string
 *       - in: body
 *         name: recurrence_counter
 *         description: Required if the offer specifies recurrence, otherwise it is not allowed
 *         type: integer
 *       - in: body
 *         name: recurrence_start
 *         description: Required if the offer specifies recurrence_base with start_any_period set, otherwise it is not allowed
 *         type: integer
 *       - in: body
 *         name: recurrence_label
 *         description: Required if recurrence_counter is set, and otherwise is not allowed
 *         type: string
 *       - in: body
 *         name: timeout
 *         description: Optional timeout; if we don't get a reply before this we fail
 *         type: string
 *         default: 60 seconds
 *     responses:
 *       201:
 *         description: On success, an object is returned
 *         schema:
 *           type: object
 *           properties:
 *             invoice:
 *               type: string
 *               description: The bolt12-encoded invoice string, starting with "lni1"
 *             changes:
 *               type: object
 *               description: Summary of changes from offer
 *               properties:
 *                   description_appended:
 *                       type: string
 *                       description: extra characters appended to the description field
 *                   description:
 *                       type: string
 *                       description: A completely replaced description field
 *                   vendor_removed:
 *                       type: string
 *                       description: The vendor from the offer, which is missing in the invoice
 *                   vendor:
 *                       type: string
 *                       description: A completely replaced vendor field
 *                   msat:
 *                       type: string
 *                       description: The amount, if different from the offer amount multiplied by any quantity
 *             next_period:
 *               type: object
 *               description: Only for recurring invoices if the next period is under the recurrence_limit
 *               properties:
 *                   counter:
 *                       type: number
 *                       description: the index of the next period to fetchinvoice
 *                   starttime:
 *                       type: number
 *                       description: UNIX timestamp that the next period starts
 *                   endtime:
 *                       type: number
 *                       description: UNIX timestamp that the next period ends
 *                   paywindow_start:
 *                       type: number
 *                       description: UNIX timestamp of the earliest time that the next invoice can be fetched
 *                   paywindow_end:
 *                       type: number
 *                       description: UNIX timestamp of the latest time that the next invoice can be fetched
 *       500:
 *         description: Server error
 */
exports.fetchInvoice = (req, res) => {
  global.logger.log("fetch invoice initiated...");

  function connFailed(err) {
    throw err;
  }
  ln.on("error", connFailed);
  //Set required params
  let clnReq = { offer: req.body.offer };
  //Set optional params
  for (const property of [
    "msatoshi",
    "quantity",
    "recurrence_counter",
    "recurrence_start",
    "recurrence_label",
    "timeout",
  ]) {
    if (typeof req.body[property] === "undefined")
      clnReq[property] = req.body[property];
  }

  //Call the fetchinvoice command with the offer and amount if specified
  ln.fetchinvoice({
    ...clnReq,
  })
    .then((data) => {
      global.logger.log("fetch invoice creation success");
      res.status(201).json(data);
    })
    .catch((err) => {
      global.logger.warn(err);
      res.status(500).json({ error: err });
    });
  ln.removeListener("error", connFailed);
};

//Function # 4
//Invoke the 'disableoffer' command to disable an offer
//Arguments - Offer id (required)
/**
 * @swagger
 * /offers/disableOffer:
 *   delete:
 *     tags:
 *       - Offers
 *     name: disableoffer
 *     summary: Disable an existing offer
 *     description: Core documentation - https://lightning.readthedocs.io/lightning-disableoffer.7.html
 *     parameters:
 *       - in: route
 *         name: offerid
 *         description: Offer ID
 *         type: string
 *         required:
 *           - offerid
 *     responses:
 *       202:
 *         description: Offer disabled successfully
 *         schema:
 *           type: object
 *           properties:
 *             offer_id:
 *               type: string
 *               description: The merkle hash of the offer (always 64 characters)
 *             active:
 *               type: boolean
 *               description: Whether the offer can produce invoices/payments (always false)
 *             single_use:
 *               type: boolean
 *               description: Whether the offer is disabled after first successful use
 *             bolt12:
 *               type: string
 *               description: The bolt12 string representing this offer
 *             bolt12_unsigned:
 *               type: string
 *               description: The bolt12 string representing this offer, without signature
 *             used:
 *               type: boolean
 *               description: Whether the offer has had an invoice paid / payment made
 *             label:
 *               type: string
 *               description: The label provided when offer was created (optional)
 *       500:
 *         description: Server error
 */
exports.disableOffer = (req, res) => {
  global.logger.log("disableOffer initiated...");

  function connFailed(err) {
    throw err;
  }
  ln.on("error", connFailed);

  //Call the close command with the params
  ln.disableoffer({
    offer_id: req.params.offerid,
  })
    .then((data) => {
      global.logger.log("disableOffer success");
      res.status(202).json(data);
    })
    .catch((err) => {
      global.logger.warn(err);
      res.status(500).json({ error: err });
    });
  ln.removeListener("error", connFailed);
};
