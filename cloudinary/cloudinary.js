// const cloudinary = require('cloudinary').v2
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config()

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDNAME, 
    api_key: process.env.CLOUDAPIKEY, 
    api_secret: process.env.CLOUDAPISECRET
});
module.exports = cloudinary