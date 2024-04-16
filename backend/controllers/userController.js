const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const { hashPassword, comparePasswords } = require('../utils/bcryptUtils');
const { generateToken } = require('../utils/jwtUtils');
const { haversineDistance } = require('../utils/distanceUtils');
const { calculateGeohashPrecision } = require('../utils/geoUtils');
const geohash = require('ngeohash');

const signup = async (req, res) => {
  const { username, password, email, address, location } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        address,
        location: {type: "Point", coordinates: [location.longitude, location.latitude]}
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
    console.log(userLocation);

    const userGeohash = geohash.encode(userLocation[0], userLocation[1], 7);
    console.log(userGeohash);
    const maxDistance = range * 1000;

    // var nearestRestaurants = await Restaurant.find(
    // {
    //   geohash: {
    //     $regex: `^${userGeohash.substring(0,5)}`,
    //   }
    // },
    // )

    var query = {
      geohash: {
        $regex: `^${userGeohash.substring(0,5)}`,
      },
    }

    const nearestRestaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [userLocation[0], userLocation[1]] },
          distanceField: 'distance',
          spherical: true,
          maxDistance: maxDistance, 
        },
      },
      {
        $match: {
          geohash: {
            $regex: `^${userGeohash.substring(0, 3)}`,
          },
        },
      },
      { $skip: skip },
      { $limit: pageSize },
    ]);

    // nearestRestaurants = nearestRestaurants.map(restaurant => {
    //   const restaurantLocation = restaurant.location.coordinates;
    //   const coord1 = {
    //     latitude: restaurantLocation[1],
    //     longitude: restaurantLocation[0]
    //   };
    //   const coord2 = {
    //     latitude: userLocation[1],
    //     longitude: userLocation[0]
    //   };
    //   const distance = haversineDistance(coord1, coord2);

    //   return {
    //     ...restaurant.toObject(), 
    //     distance: distance
    //   };
    // });
    // nearestRestaurants.sort((a, b) => a.distance - b.distance);
    res.json({ nearestRestaurants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { signup, login, getUserProfile, getNearestRestaurant };