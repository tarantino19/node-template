// server/src/models/PasswordReset.js
const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	token: { type: String, required: true },
	expiresAt: { type: Date, required: true },
});

// Indexes
passwordResetSchema.index({ user: 1 });
passwordResetSchema.index({ token: 1 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
