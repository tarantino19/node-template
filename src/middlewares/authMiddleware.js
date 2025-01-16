const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
	const token = req.cookies.jwt;

	if (!token) {
		return res.status(401).json({ message: 'Access denied. No token provided.' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Fetch the user from the database
		const user = await User.findById(decoded.userId).select('-password'); // Exclude the password field
		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}

		req.user = user;

		next();
	} catch (error) {
		console.error('Error in authenticateUser:', error);
		if (error.name === 'JsonWebTokenError') {
			return res.status(400).json({ message: 'Invalid token.' });
		}

		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ message: 'Token expired. Please log in again.' });
		}

		res.status(500).json({ message: 'Internal server error.' });
	}
};

module.exports = authenticateUser;

const isAdmin = async (req, res, next) => {
	if (!req.user || req.user.userType !== 'super-admin') {
		return res.status(403).json({ message: 'Forbidden. Admin access required.' });
	}

	next();
};

module.exports = { authenticateUser, isAdmin };
