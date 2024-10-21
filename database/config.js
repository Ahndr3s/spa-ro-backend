const mongoose = require('mongoose')

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION)
        console.log('db connected') 
    } catch (error) {
        console.log(error)
        throw new Error('Error at initianing database')
    }
}

module.exports = {dbConnection}