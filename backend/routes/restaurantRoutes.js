const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/signup', restaurantController.signup);
router.post('/login', restaurantController.login);
router.get('/profile', authMiddleware, restaurantController.getRestaurantProfile);
router.get('/', authMiddleware, restaurantController.getRestaurant);
router.post('/menu', authMiddleware, restaurantController.addMenuItem);
router.get('/menu/:id', authMiddleware, restaurantController.getMenuItems);
router.put('/menu/:id', authMiddleware, restaurantController.updateMenuItem);
router.delete('/menu/:id', authMiddleware, restaurantController.deleteMenuItem);


module.exports = router;
