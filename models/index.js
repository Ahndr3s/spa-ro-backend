const Product = require('./Product')
const User  = require('./User')
const Banner = require("./Banner") 

module.exports = {
    Product, 
    Banner,
    ...User, 
}