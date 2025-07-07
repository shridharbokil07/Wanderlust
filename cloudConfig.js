const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ❌ Incorrect import (not needed)
// const { param } = require("./routes/listing"); 

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET // ✅ Fixed typo: 'emv' → 'env'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowed_formats: ["png", "jpg", "jpeg"] // ✅ Correct key: 'allowed_formats' not 'allowedFormat'
    }
});

module.exports = {
    cloudinary,
    storage
};
