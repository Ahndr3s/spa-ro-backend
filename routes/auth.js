const {Router} = require('express')
const {check} = require('express-validator')
const router = Router()
const { createUser, loginUser, renewToken } = require('../controllers/authController')
const { validateFields } = require('../middlewares/validateFields')
const { validateJWT } = require('../middlewares/validate-jwt')


router.post(
    '/new', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email proporcionado es invalido').isEmail(),
        check('password', 'La password debe tener minimo 6 caracteres').isLength({min: 6}),
        validateFields
    ], 
    createUser)

router.post('/', 
    [
        check('email', 'El email proporcionado es invalido').isEmail(),
        check('password', 'La password debe tener minimo 6 caracteres').isLength({min: 6}),
        validateFields
    ], 
    loginUser)

router.get('/renew', [
    validateJWT
], renewToken)

module.exports = router