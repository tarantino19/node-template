const Image = require("../models/Image");

const imageService = {
  createImage: async (req, res) => {
    try {
      const image = new Image(req.body);
      await image.save();
      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  uploadImage: async (req, res) => {
    try {
      const { url, filename, title, description, tags } = req.body;
      const userId = req.user.id;
  
      const image = await Image.create({
        url,
        filename,
        title,
        description,
        tags,
        uploadedBy: userId,
      });
  
      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getImageById: async (req, res) => {
    try {
      const image = await Image.findById(req.params.imageId).populate("album user");
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.status(200).json(image);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateImage: async (req, res) => {
    try {
      const image = await Image.findByIdAndUpdate(req.params.imageId, req.body, {
        new: true,
      });
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.status(200).json(image);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteImage: async (req, res) => {
    try {
      const image = await Image.findByIdAndDelete(req.params.imageId);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getImagesByAlbum: async (req, res) => {
    try {
      const images = await Image.find({ album: req.params.albumId });
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = imageService;