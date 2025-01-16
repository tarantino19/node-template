// server/src/models/Album.js
const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
	title: { type: String, required: true, default: 'New Album' },
	description: { type: String, default: '' },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	isPublic: { type: Boolean, default: false },
	password: { type: String, default: '' },
	thumbnailUrl: { type: String, default: '' },
	images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	tags: [{ type: String }],
	sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	permissions: {
		type: String,
		enum: ['view', 'edit', 'delete'],
		default: 'view',
	},
	isFeatured: { type: Boolean, default: false },
	featuredAt: { type: Date },
	storageUsed: { type: Number, default: 0 },
});

// Indexes
albumSchema.index({ user: 1 });
albumSchema.index({ title: 'text', description: 'text', tags: 'text' });
albumSchema.index({ createdAt: -1 });
albumSchema.index({ isFeatured: 1, featuredAt: -1 });

module.exports = mongoose.model('Album', albumSchema);
