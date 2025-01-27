const Product = require('./Product')
const User  = require('./User')
const Banner = require("./Banner") 
const Category = require("./Category") 


module.exports = {
    Product, 
    Banner,
    Category,
    ...User, 
}