// server/src/loaders/mongoose.js
const mongoose = require('mongoose');
const config = require('../config');

module.exports = async () => {
	try {
		await mongoose.connect(config.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB connected');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
};
