const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { getProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/productsController");

// GET PRODUCTS
router.get('/', getProducts)

// EVERY ROUTE HAS TO BE VALIDATED
router.use(validateJWT)

// CREATE PRODUCT
// router.post('/', upload.single('img'), [
router.post('/', [
    check('type', 'The product must have a type!!').not().isEmpty(),
    check('title', 'You need to add a title!!').not().isEmpty(),
    check('size', 'The product needs to have size!!').not().isEmpty(),
    check('category', 'The product needs to have category!!').not().isEmpty(),
    check('price', 'The product needs to have price!!').not().isEmpty(),
    check('info', 'The product needs to have info!!').not().isEmpty(),
    check('stock', 'The product needs to have stock!!').not().isEmpty(),
    validateFields
], createProduct)

// UPDATE PRODUCT
router.put('/:id',[
    check('type', 'The products must have a type!!').not().isEmpty(),
    check('title', 'You need to add a title!!').not().isEmpty(),
    check('size', 'The product needs to have size!!').not().isEmpty(),
    check('category', 'The product needs to have category!!').not().isEmpty(),
    check('price', 'The product needs to have price!!').not().isEmpty(),
    check('info', 'The product needs to have info!!').not().isEmpty(),
    check('stock', 'The product needs to have stock!!').not().isEmpty(),
    validateFields
], updateProduct)

// DELETE PRODUCT
router.delete('/:id', deleteProduct)

module.exports = router