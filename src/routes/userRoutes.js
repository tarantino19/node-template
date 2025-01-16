// server/src/routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/', userController.createUser);
router.get('/:userId', userController.getUserById);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);
router.get('/', userController.getAllUsers);

module.exports = router;
