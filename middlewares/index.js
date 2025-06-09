const validateFiels = require('./validate-fields')
const validaJWT = require('./validate-jwt')

module.exports = {
    ...validateFiels,
    ...validaJWT
}