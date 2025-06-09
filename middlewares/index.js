const validateFiels = require('./validate-fields')
// const validateFiles  = require('./validate-files')
const validaJWT = require('./validate-jwt')

module.exports = {
    ...validateFiels,
    ...validaJWT
}