const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { getSales, createSale, updateSale, deleteSale, getSalesOfTheMonth, getMostSoldProductOfTheMonth } = require("../controllers/salesController");
const router = Router()

// CREATE SALES
router.post('/', [
    check('type', 'The category must have a type!!').not().isEmpty(),
    check('saleDate', 'The content must have a date!!').not().isEmpty(),
    check('clientName', 'The client must have a name!!').not().isEmpty(),
    check('clientEmail', 'The client must have a email!!').not().isEmpty(),
    check('contactAddress', 'The client must have a conatct address!!').not().isEmpty(),
    check('sellingProducts', 'You must add a product!!').not().isEmpty(),
    check('subTotal', 'Every sale must have a subTotal amount!!').not().isEmpty(),
    check('contactReg', 'Every sale must have a region value!!').not().isEmpty(),
    check('regTariff', 'Every sale must have a region tariff amount!!').not().isEmpty(),
    // check('iva', 'Every sale must have an IVA amount!!').not().isEmpty(),
    // check('total', 'Every sale must have a Total amount!!').not().isEmpty(),
    validateFields
], createSale)

// GET SALES
router.get('/', getSales)

// EVERY ROUTE MUST BE VALIDATE
router.use(validateJWT)

// UPDATE SALES
router.post('/:id', [
    check('saleDate', 'The content must have a date!!').not().isEmpty(),
    check('clientName', 'The client must have a name!!').not().isEmpty(),
    check('clientEmail', 'The client must have a email!!').not().isEmpty(),
    check('sellingProducts', 'You must add a product!!').not().isEmpty(),
    check('subTotal', 'Every sale must have a subTotal amount!!').not().isEmpty(),
    check('iva', 'Every sale must have an IVA amount!!').not().isEmpty(),
    check('total', 'Every sale must have a Total amount!!').not().isEmpty(),
    validateFields
], updateSale)

// DELETE SALE
router.delete('/:id', deleteSale)

//-------------------------ANALYTICS-------------------------------

// GET MOST SOLD PRODUCT OF THE MONTH
router.get('/summary/mostSoldOfTheMonth/:inputDate', getMostSoldProductOfTheMonth);

// GET SALES OF THE MONTH
router.get('/summary/salesOfTheMonth/', getSalesOfTheMonth);


module.exports = router 