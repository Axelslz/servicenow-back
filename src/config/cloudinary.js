const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: file.mimetype === 'application/pdf' ? 'PolizaPDF-Agentlite' : 'UserImg-Agentlite',
      resource_type: 'auto', 
      allowed_formats: ['jpeg', 'png', 'jpg', 'pdf'], 
    };
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };