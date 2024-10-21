const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { getSales, createSale, updateSale, deleteSale } = require("../controllers/salesController");
const router = Router()

// EVERY ROUTE MUST BE VALIDATE
router.use(validateJWT)

// GET SALES
router.get('/', getSales)

// CREATE SALES
router.post('/', [
    check('saleDate', 'The content must have a date!!').not().isEmpty(),
    check('clientName', 'The client must have a name!!').not().isEmpty(),
    check('clientEmail', 'The client must have a email!!').not().isEmpty(),
    check('product', 'You must add a product!!').not().isEmpty(),
    check('price', 'The costume needs to have price!!').not().isEmpty(),
    check('quantity', 'The costume needs to have info!!').not().isEmpty(),
    validateFields
], createSale)

// UPDATE SALES
router.post('/:id', [
    check('saleDate', 'The content must have a date!!').not().isEmpty(),
    check('clientName', 'The client must have a name!!').not().isEmpty(),
    check('clientEmail', 'The client must have a email!!').not().isEmpty(),
    check('product', 'You must add a product!!').not().isEmpty(),
    check('price', 'The costume needs to have price!!').not().isEmpty(),
    check('quantity', 'The costume needs to have info!!').not().isEmpty(),
    validateFields
], updateSale)

// DELETE SALE
router.delete('/:id', deleteSale)

module.exports = router 