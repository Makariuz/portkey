const dotenv = require("dotenv");
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')
dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloud_name, 
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret, 
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_format: ['jpg', 'png'],
    folder: 'profile-pictures'
  }
})

module.exports = multer({ storage })
