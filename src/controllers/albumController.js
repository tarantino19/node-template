const AlbumService = require("../services/albumService");

const albumController = {
  createAlbum: async (req, res) => {
    await AlbumService.createAlbum(req, res);
  },

  updateAlbum: async (req, res) => {
    await AlbumService.updateAlbum(req, res);
  },

  getAlbumById: async (req, res) => {
    await AlbumService.getAlbumById(req, res);
  },

  deleteAlbum: async (req, res) => {
    await AlbumService.deleteAlbum(req, res);
  },

  getAlbumsByUser: async (req, res) => {
    await AlbumService.getAlbumsByUser(req, res);
  },
};

module.exports = albumController;