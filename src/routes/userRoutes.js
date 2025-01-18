// server/src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');
const rateLimiter = require('../middlewares/raterLimiter');

const router = express.Router();

router.post('/logout', userController.logOut);
router.get('/profile', authenticateUser, userController.getUserProfile);
router.post('/', userController.createUser);
router.post('/login', rateLimiter, userController.loginUser);
router.get('/:userId', authenticateUser, isAdmin, userController.getUserById);
router.put('/:userId', authenticateUser, isAdmin, userController.updateUser);
router.delete('/:userId', authenticateUser, isAdmin, userController.deleteUser);
router.get('/', authenticateUser, isAdmin, userController.getAllUsers);

module.exports = router;
