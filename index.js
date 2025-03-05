const express = require('express')
const { dbConnection } = require('./database/config')
const cors = require('cors')
const fileUpload = require('express-fileupload')
require('dotenv').config()

const app = express()

dbConnection()

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true, // Permite enviar cookies y encabezados de autenticación
    }
))
app.use(express.static('public'))

// READING AND PARSING OF BODY REQUEST
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use(fileUpload({ 
    createParentPath: true, 
    tempFileDir: "/tmp/", 
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 } // limit file size to 50MB
}));

// ROUTES
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/banners', require('./routes/banners'))
app.use('/api/sales', require('./routes/sales'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/categories', require('./routes/categories'))



// REQUESTS LISTENING
app.listen(process.env.PORT, () => {
    console.log(`SERVER LISTENING ON PORT ${process.env.PORT}`)
})
