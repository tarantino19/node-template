const UserService = require('../services/userService');

const userController = {
	createUser: async (req, res) => {
		await UserService.createUser(req, res);
	},

	loginUser: async (req, res) => {
		await UserService.loginUser(req, res);
	},

	getAllUsers: async (req, res) => {
		await UserService.getAllUsers(req, res);
	},

	getUserById: async (req, res) => {
		await UserService.getUserById(req, res);
	},

	updateUser: async (req, res) => {
		await UserService.updateUser(req, res);
	},

	deleteUser: async (req, res) => {
		await UserService.deleteUser(req, res);
	},

	getUserProfile: async (req, res) => {
		await UserService.getUserProfile(req, res);
	},

	logOut: async (req, res) => {
		await UserService.logOut(req, res);
	},
};

module.exports = userController;
