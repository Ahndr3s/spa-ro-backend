const { Router } = require("express");
const router = Router()
const { checkoutOrder, checkoutSuccess, cancelCheckout } = require("../controllers/paymentController");

router.get('/createOrder', checkoutOrder)
router.get('/successOrder', checkoutSuccess)
router.get('/cancelOrder', cancelCheckout)

module.exports = router