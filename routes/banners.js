const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { getBanners, createBanner, updateBanner, deleteBanner } = require("../controllers/bannerController");

// GET BANNERS
router.get('/', getBanners)

// EVERY ROUTE HAS TO BE VALIDATED
router.use(validateJWT)

// CREATE BANNER
// router.post('/', upload.single('img'), [
router.post('/', [
    check('type', 'The products must have a type!!').not().isEmpty(),
    check('title', 'You need to add a title!!').not().isEmpty(),
    check('subtitle1', 'You need to add a subtitle!!').not().isEmpty(),
    check('subtitle2', 'You need to add a second subtitle!!').not().isEmpty(),
    check('category', 'You need to add a category!!').not().isEmpty(),
    validateFields
], createBanner)

// UPDATE BANNER
router.put('/:id',[
    check('type', 'The products must have a type!!').not().isEmpty(),
    check('title', 'You need to add a title!!').not().isEmpty(),
    check('subtitle1', 'You need to add a subtitle!!').not().isEmpty(),
    check('subtitle2', 'You need to add a second subtitle!!').not().isEmpty(),
    check('category', 'You need to add a category!!').not().isEmpty(),
    validateFields
], updateBanner)

// DELETE BANNER
router.delete('/:id', deleteBanner)

module.exports = router