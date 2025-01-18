// server/src/models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
	url: { type: String, required: true },
	thumbnailUrl: { type: String, required: true },
	album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	size: { type: Number, required: true },
	uploadedAt: { type: Date, default: Date.now },
	isPublic: { type: Boolean, default: false },
	filename: { type: String, required: true },
	fileType: { type: String, required: true },
	dimensions: {
		width: { type: Number },
		height: { type: Number },
	},
	description: { type: String, default: '' },
	tags: [{ type: String }],
	status: {
		type: String,
		enum: ['uploading', 'uploaded', 'failed'],
		default: 'uploading',
	},
	uploadProgress: { type: Number, default: 0 },
	isFavorite: { type: Boolean, default: false },
	views: { type: Number, default: 0 },
	likes: { type: Number, default: 0 },
	expiresAt: { type: Date },
});

// Indexes
imageSchema.index({ album: 1 });
imageSchema.index({ user: 1 });
imageSchema.index({ tags: 1 });
imageSchema.index({ uploadedAt: -1 });

module.exports = mongoose.model('Image', imageSchema);
