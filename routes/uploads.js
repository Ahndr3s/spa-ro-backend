const { Router } = require("express");
const {check} = require('express-validator');
const router = Router();
const { uploadFile, updateImage, showImage, updateImageCloudinary } = require("../controllers/uploadsController");
const { allowedCollections } = require("../helpers");
const {  validateFields, validateUploads } = require("../middlewares");
const cloudinary = require("../cloudinary/cloudinary");

// UPLOAD IMAGE ON SPECIFIED MODEL
router.post('/', validateUploads ,uploadFile)
// router.post('/', uploadFile)

// UPDATE IMAGE O SPECIFIED MODEL
router.put('/:collection/:id', [
    // validateUploads, 
    check('id', 'This is not a mongo id').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'costumes'])),
    validateFields,
// ], updateImage)
], updateImageCloudinary)

// GET IMAGES OF SPECIFIED MODEL
router.get('/:collection/:id', [
    check('id', 'This is not a mongo id').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'costumes'])),
    validateFields,
], showImage)


router.delete('/:collection/:id', async (req, res) => {
// router.delete('/:folder/:publicId', async (req, res) => {
  const { folder, publicId } = req.params;
  const fullPublicId = `ServerNode/${folder}/${publicId}`;

  try {
    const result = await cloudinary.uploader.destroy(fullPublicId);
    if (result.result !== 'ok' && result.result !== 'not found') {
      return res.status(500).json({ error: 'Failed to delete image' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router