// server/src/loaders/index.js
const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');

module.exports = async () => {
	await mongooseLoader();
	const app = expressLoader();
	return app;
};
