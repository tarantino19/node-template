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

	requestPasswordChange: async (req, res) => {
		try {
			const user = req.user; // Assuming req.user is populated by authenticateUser middleware

			// Generate a new 4-digit confirmation code
			const confirmationCode = generateConfirmationCode();

			// Set the expiration time to 30 minutes from now
			const confirmationCodeExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

			// Update the user's confirmation code and expiration time
			user.confirmationCode = confirmationCode;
			user.confirmationCodeExpires = confirmationCodeExpires;
			await user.save();

			// Send the confirmation code via email
			await sendEmailChangePassword(user.email, confirmationCode);

			res.status(200).json({ message: 'Confirmation code sent to your email.' });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	changePassword: async (req, res) => {
		try {
			const { newPassword, confirmationCode } = req.body;
			const user = req.user; // Assuming req.user is populated by authenticateUser middleware

			// Check if the confirmation code matches
			if (user.confirmationCode !== confirmationCode) {
				return res.status(400).json({ message: 'Invalid confirmation code.' });
			}

			// Check if the confirmation code is still valid (not expired)
			if (user.confirmationCodeExpires < new Date()) {
				return res.status(400).json({ message: 'Confirmation code has expired.' });
			}

			// Hash the new password
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

			// Update the user's password and clear the confirmation code and expiration time
			user.password = hashedPassword;
			user.confirmationCode = null;
			user.confirmationCodeExpires = null;
			await user.save();

			res.status(200).json({ message: 'Password changed successfully.' });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	logOut: async (req, res) => {
		try {
			// When clearing the cookie (e.g., during logout)
			res.clearCookie('jwt', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
			});

			res.status(200).json({ message: 'Logged out successfully' });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
};

module.exports = userService;
