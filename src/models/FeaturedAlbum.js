const mongoose = require('mongoose');

const featuredAlbumSchema = new mongoose.Schema({
	album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true }, // Reference to the featured album
	featuredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the admin who featured the album
	featuredAt: { type: Date, default: Date.now },
});

// Indexes for faster queries
featuredAlbumSchema.index({ album: 1 });
