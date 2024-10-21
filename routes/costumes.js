const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { getCostumes, createCostume, updateCostume, deleteCostume } = require("../controllers/costumesController");

// GET COURSES
router.get('/', getCostumes)

// EVERY ROUTE HAS TO BE VALIDATED
router.use(validateJWT)

// CREATE COSTUMES
// router.post('/', upload.single('img'), [
router.post('/', [
    check('type', 'The content must have a type!!').not().isEmpty(),
    check('title', 'You need to add a title!!').not().isEmpty(),
    check('size', 'The costume needs to have size!!').not().isEmpty(),
    check('category', 'The costume needs to have category!!').not().isEmpty(),
    check('price', 'The costume needs to have price!!').not().isEmpty(),
    check('info', 'The costume needs to have info!!').not().isEmpty(),
    check('stock', 'The costume needs to have stock!!').not().isEmpty(),
    validateFields
], createCostume)

// UPDATE COSTUMES
router.put('/:id',[
    check('type', 'The content must have a type!!').not().isEmpty(),
    check('title', 'You need to add a title!!').not().isEmpty(),
    check('size', 'The costume needs to have size!!').not().isEmpty(),
    check('category', 'The costume needs to have category!!').not().isEmpty(),
    check('price', 'The costume needs to have price!!').not().isEmpty(),
    check('info', 'The costume needs to have info!!').not().isEmpty(),
    check('stock', 'The costume needs to have stock!!').not().isEmpty(),
    validateFields
], updateCostume)

// DELETE COSTUME
router.delete('/:id', deleteCostume)

module.exports = router