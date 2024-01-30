const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const { hashPassword, comparePasswords } = require('../utils/bcryptUtils');
const { generateToken } = require('../utils/jwtUtils');

const signup = async (req, res) => {
  const { username, password, email, address, location } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        address,
        location: {type: "Point", coordinates: [location.latitude, location.longitude]}
      });

      const savedUser = await newUser.save();

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

    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = generateToken({ userId: user._id, role: user.role });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);
  res.json({ user });
};

const getNearestRestaurant = async (req, res) => {
  const userId = req.user.userId; 
  const range = parseFloat(req.query.range) || 5; 
  const page = parseInt(req.query.page) || 1; 
  const pageSize = parseInt(req.query.pageSize) || 10; 

  try {
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
          maxDistance: range * 1000, 
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