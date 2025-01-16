// server/src/models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
	album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	submittedAt: { type: Date, default: Date.now },
	status: {
		type: String,
		enum: ['pending', 'approved', 'rejected'],
		default: 'pending',
	},
});

// Indexes
submissionSchema.index({ album: 1 });
submissionSchema.index({ user: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
