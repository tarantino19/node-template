// server/src/routes/albumRoutes.js
const express = require('express');
const albumController = require('../controllers/albumController');

const router = express.Router();

router.post('/', albumController.createAlbum);
router.get('/:albumId', albumController.getAlbumById);
router.put('/:albumId', albumController.updateAlbum);
router.delete('/:albumId', albumController.deleteAlbum);
router.get('/user/:userId', albumController.getAlbumsByUser);

module.exports = router;
