const Costume = require('./Costumes')
const User  = require('./User')

module.exports = {
    Costume, 
    ...User, 
}