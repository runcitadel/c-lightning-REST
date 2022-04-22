const router = require("express").Router();
const invoiceController = require("../controllers/invoice");
const tasteMacaroon = require("../utils/tasteMacaroon");

//Generate bolt11 invoice
router.post("/genInvoice", tasteMacaroon, invoiceController.genInvoice);

//List invoices
router.get("/listInvoices", tasteMacaroon, invoiceController.listInvoice);

//Delete expired invoices
router.delete(
  "/delExpiredInvoice",
  tasteMacaroon,
  invoiceController.delExpiredInvoice
);

//Delete invoice
router.delete(
  "/delInvoice/:label/:status",
  tasteMacaroon,
  invoiceController.delInvoice
);

//Wait invoice
router.get("/waitInvoice/:label", tasteMacaroon, invoiceController.waitInvoice);

module.exports = router;
