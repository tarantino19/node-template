// server/src/routes/imageRoutes.js
const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();

router.post('/', imageController.createImage);
router.get('/:imageId', imageController.getImageById);
router.put('/:imageId', imageController.updateImage);
router.delete('/:imageId', imageController.deleteImage);
router.get('/album/:albumId', imageController.getImagesByAlbum);

module.exports = router;
