const Album = require("../models/Album");

const albumService = {
  /**
   * Create a new album with a default title.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  createAlbum: async (req, res) => {
    try {
      const { user } = req.body; // Only the user ID is required initially

      // Create a new album with the default title
      const album = new Album({
        title: "New Album", // Default title
        user, // Required user ID
      });

      // Save the album to the database
      await album.save();

      res.status(201).json(album);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Update an album's details (e.g., title, description, tags, etc.).
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  updateAlbum: async (req, res) => {
    try {
      const { title, description, tags, isPublic, imageIds } = req.body;
      const albumId = req.params.albumId;
  
      // Find the album
      const album = await Album.findById(albumId);
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
  
      // Check if the authenticated user is the owner of the album
      if (album.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to update this album" });
      }
  
      // Prepare update object
      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (tags) updateData.tags = tags;
      if (isPublic !== undefined) updateData.isPublic = isPublic;
      if (imageIds) updateData.$addToSet = { images: { $each: imageIds } }; // Add image IDs to the album
  
      // Update the album
      const updatedAlbum = await Album.findByIdAndUpdate(albumId, updateData, {
        new: true, // Return the updated album
      });
  
      res.status(200).json(updatedAlbum);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get an album by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  getAlbumById: async (req, res) => {
    try {
      const album = await Album.findById(req.params.albumId).populate("user images");
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
      res.status(200).json(album);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Delete an album by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  deleteAlbum: async (req, res) => {
    try {
      const album = await Album.findByIdAndDelete(req.params.albumId);
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get all albums by user ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  getAlbumsByUser: async (req, res) => {
    try {
      const albums = await Album.find({ user: req.params.userId });
      res.status(200).json(albums);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = albumService;