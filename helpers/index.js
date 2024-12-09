const dbValidators = require('./db-validators')
const generateJWT  = require('./jwt')
const uploadFile   = require('./upload-files')

module.exports = {
    ...dbValidators, 
    ...generateJWT, 
    ...uploadFile
}