// server/src/loaders/express.js
const express = require('express');
const cors = require('cors');
const albumRoutes = require('../routes/albumRoutes');
const imageRoutes = require('../routes/imageRoutes');
const surveyRoutes = require('../routes/surveyRoutes');
const userRoutes = require('../routes/userRoutes');
const submissionRoutes = require('../routes/submissionRoutes');

module.exports = () => {
	const app = express();

	// Middleware
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true })); 

	// Routes
	app.use('/api/albums', albumRoutes);
	app.use('/api/images', imageRoutes);
	app.use('/api/submissions', submissionRoutes);
	app.use('/api/surveys', surveyRoutes);
	app.use('/api/users', userRoutes);

	return app;
};
