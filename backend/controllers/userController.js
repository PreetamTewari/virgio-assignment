// src/controllers/userController.js
const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const { hashPassword, comparePasswords } = require('../utils/bcryptUtils');
const { generateToken } = require('../utils/jwtUtils');

const signup = async (req, res) => {
  const { username, password, email, address, location } = req.body;

  try {
    // Hash the password before saving to the database
    const hashedPassword = await hashPassword(password);

      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        address,
        location: {type: "Point", coordinates: [location.latitude, location.longitude]}
      });

      const savedUser = await newUser.save();

      // Generate a token for the new user
      const token = generateToken({ userId: savedUser._id, role: savedUser.role });

      res.json({ token });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    let user;

    user = await User.findOne({ username });
    

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate a token for the logged-in user
    const token = generateToken({ userId: user._id, role: user.role });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserProfile = async (req, res) => {
  // Implement logic to fetch user/restaurant details using req.user
  res.json({ user: req.user });
};

const getNearestRestaurant = async (req, res) => {
  const userId = req.user.userId; // Assuming the user ID is provided in the URL parameter
  const range = parseFloat(req.query.range) || 5; // Default range is 5 kilometers
  const page = parseInt(req.query.page) || 1; // Default page is 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Default page size is 10

  try {
    // Retrieve the user's location
    const user = await User.findById(userId);
    const userLocation = user.location.coordinates;
    const skip = (page - 1) * pageSize;

    const nearestRestaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: userLocation,
          },
          distanceField: 'distance',
          maxDistance: range * 1000, // Convert range to meters
          spherical: true,
        },
      },
      { $skip: skip },
      { $limit: pageSize },
    ]);

    res.json({ nearestRestaurants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { signup, login, getUserProfile, getNearestRestaurant };