// server/src/app.js
const loaders = require('./loaders');

const startServer = async () => {
	const app = await loaders();
	const port = process.env.PORT || 3000;

	app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
};

startServer();

//justfortest
