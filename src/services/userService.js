const User = require('../models/User');
const bcrypt = require('bcrypt');
const { get } = require('mongoose');
const validator = require('validator');

const userService = {
	createUser: async (req, res) => {
		const { username, email, password, profilePicture, userType } = req.body;

		try {
			// Validate required fields
			if (!username || !email || !password) {
				return res.status(400).json({ message: 'Username, email, and password are required.' });
			}

			// Validate email format
			if (!validator.isEmail(email)) {
				return res.status(400).json({ message: 'Invalid email format.' });
			}

			// Validate password length (example: minimum 6 characters)
			if (password.length < 6) {
				return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
			}

			// Validate userType (must be one of the enum values)
			const validUserTypes = ['user', 'admin', 'super-admin', 'startup-owner'];
			if (userType && !validUserTypes.includes(userType)) {
				return res.status(400).json({ message: 'Invalid user type.' });
			}

			// Check if email or username already exists
			const existingUser = await User.findOne({ $or: [{ email }, { username }] });
			if (existingUser) {
				return res.status(400).json({ message: 'Email or username already exists.' });
			}

			// Hash the password
			const saltRounds = 10; // Number of salt rounds for hashing
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			// Create and save the user
			const user = new User({
				username,
				email,
				password: hashedPassword, // Save the hashed password
				profilePicture: profilePicture || '', // Default to empty string if not provided
				userType: userType || 'user', // Default to 'user' if not provided
			});

			await user.save();
			res.status(201).json(user);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	getAllUsers: async (req, res) => {
		try {
			const users = await User.find();
			res.status(200).json(users);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	getUserById: async (req, res) => {
		try {
			const user = await User.findById(req.params.userId);
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}
			res.status(200).json(user);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	updateUser: async (req, res) => {
		try {
			const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
				new: true,
			});
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}
			res.status(200).json(user);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	deleteUser: async (req, res) => {
		try {
			const user = await User.findByIdAndDelete(req.params.userId);
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
};

module.exports = userService;
