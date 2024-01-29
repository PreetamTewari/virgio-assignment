// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.get('/profile', authMiddleware, userController.getUserProfile);
router.get('/nearest-restaurant', authMiddleware, userController.getNearestRestaurant);

module.exports = router;
