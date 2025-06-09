// const cloudinary = require('cloudinary').v2
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config()

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDNAME, 
    api_key: process.env.CLOUDAPIKEY, 
    api_secret: process.env.CLOUDAPISECRET,
    upload_preset: process.env.UPLOADPRESET// Click 'View Credentials' below to copy your API secret
});

module.exports = cloudinary