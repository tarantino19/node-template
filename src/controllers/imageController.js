const ImageService = require("../services/imageService");

const imageController = {
  createImage: async (req, res) => {
    await ImageService.createImage(req, res);
  },

  getImageById: async (req, res) => {
    await ImageService.getImageById(req, res);
  },

  updateImage: async (req, res) => {
    await ImageService.updateImage(req, res);
  },

  deleteImage: async (req, res) => {
    await ImageService.deleteImage(req, res);
  },

  getImagesByAlbum: async (req, res) => {
    await ImageService.getImagesByAlbum(req, res);
  },

  uploadImage: async (req, res) => {
    await ImageService.uploadImage(req, res);
  },
};

module.exports = imageController;