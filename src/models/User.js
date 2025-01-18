// server/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		emailConfirmed: { type: Boolean, default: false },
		profilePicture: { type: String, default: '', required: false },
		storageUsed: { type: Number, default: 0 },
		storageLimit: { type: Number, default: 2 * 1024 * 1024 * 1024 }, // 1GB in bytes  //make thuis 2 gb
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
		confirmationCode: {
			type: String,
			default: null,
			validate: {
				validator: function (code) {
					// Ensure the code is exactly 4 digits long
					return /^\d{4}$/.test(code);
				},
				message: 'Confirmation code must be exactly 4 digits long.',
			},
		},
		confirmationCodeExpires: { type: Date, default: null },
		userType: {
			enum: ['user', 'admin', 'super-admin', 'startup-owner'],
			type: String,
			default: 'user',
		},
	},
	{ strict: true }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);
