// server/src/config/index.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	PORT: process.env.PORT || 5000,
	MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/albumapp',
	JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
};
