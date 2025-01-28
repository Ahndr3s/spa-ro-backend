const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { getCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

// GET CATEGORIES
router.get('/', getCategories)

// EVERY ROUTE HAS TO BE VALIDATED
router.use(validateJWT)

// CREATE CATEGORY
// router.post('/', upload.single('img'), [
router.post('/', [
    check('type', 'The category must have a type!!').not().isEmpty(),
    check('title', 'You need to add a title!!').not().isEmpty(),
    validateFields
], createCategory)

// UPDATE CATEGORY
router.put('/:id',[
    check('type', 'The category must have a type!!').not().isEmpty(),
    check('title', 'You need to add a title!!').not().isEmpty(),
    validateFields
], updateCategory)

// DELETE CATEGORY
router.delete('/:id', deleteCategory)

module.exports = router