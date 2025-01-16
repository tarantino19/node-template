// server/src/models/Survey.js
const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	step1: { type: String, required: true },
	step2: { type: String, required: true },
	step3: { type: String, required: true },
	submittedAt: { type: Date, default: Date.now },
});

// Indexes
surveySchema.index({ user: 1 });

module.exports = mongoose.model('Survey', surveySchema);
