// const cloudinary = require('cloudinary').v2
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config()

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDNAME, 
    api_key: process.env.CLOUDAPIKEY, 
    api_secret: process.env.CLOUDAPISECRET,
    upload_preset: process.env.UPLOADPRESET
});
 console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
module.exports = cloudinary