const User = require('../models/User');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userService = {
	createUser: async (req, res) => {
		const { username, email, password, profilePicture, userType } = req.body;

		try {
			if (!username || !email || !password) {
				return res.status(400).json({ message: 'Username, email, and password are required.' });
			}

			if (!validator.isEmail(email)) {
				return res.status(400).json({ message: 'Invalid email format.' });
			}

			if (password.length < 6) {
				return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
			}

			const validUserTypes = ['user', 'admin', 'super-admin', 'startup-owner'];
			if (userType && !validUserTypes.includes(userType)) {
				return res.status(400).json({ message: 'Invalid user type.' });
			}

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

	loginUser: async (req, res) => {
		try {
			const { email, password } = req.body;

			if (!email && !password) {
				return res.status(400).json({ message: 'Credentials are required.' });
			}

			const user = await User.findOne({ email });
			if (!user) {
				return res.status(401).json({ message: 'Unauthorized credentials.' });
			}

			const isPasswordMatch = await bcrypt.compare(password, user.password);
			if (!isPasswordMatch) {
				return res.status(401).json({ message: 'Invalid credentials.' });
			}

			const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
				expiresIn: '7d',
			});

			res.cookie('jwt', accessToken, {
				httpOnly: true,
				secure: true,
				maxAge: 7 * 24 * 60 * 60 * 1000,
				sameSite: 'strict',
			});

			res
				.status(200)
				.json({ message: 'Login successful.', name: user.username, email: user.email, userType: user.userType });
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
			const { username, email, password, profilePicture, userType } = req.body;

			if (!username && !email && !password && !profilePicture && !userType) {
				return res.status(400).json({ message: 'No fields to update' });
			}

			const user = await User.findByIdAndUpdate(req.params.id, req.body, {
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
			const user = await User.findByIdAndDelete(req.params.id);
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}
			res.status(204).send({ message: 'User deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	getUserProfile: async (req, res) => {
		try {
			const user = req.user;

			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}
			res.status(200).json(user);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
};

module.exports = userService;
