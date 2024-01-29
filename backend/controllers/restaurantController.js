const Restaurant = require('../models/restaurant');
const Menu = require('../models/menu');
const { hashPassword, comparePasswords } = require('../utils/bcryptUtils');
const { generateToken } = require('../utils/jwtUtils');


const signup = async (req, res) => {
    const { username, password, address, location, name, is_open, opening_hours, closing_hours } = req.body;
  
    try {
      // Hash the password before saving to the database
      const hashedPassword = await hashPassword(password);

        const newRestaurant = new Restaurant({
            name,
            username,
            password: hashedPassword,
            address,
            location: {type: "Point", coordinates: [location.latitude, location.longitude]},
            is_open,
            opening_hours,
            closing_hours,
        });

        const savedRestaurant = await newRestaurant.save();

        // Generate a token for the new restaurant user
        const token = generateToken({ userId: savedRestaurant._id, role: savedRestaurant.role });

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

        user = await Restaurant.findOne({ username });
  
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

  const getRestaurant = async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      res.json(restaurant);
    } catch(error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
 };

 const addMenuItem = async (req, res) => {
    // console.log(req)
    // return
    const { name, description, pricePerUnit, is_available } = req.body;
    const restaurantId = req.user.userId; // Assuming you get the restaurantId from the route parameter
  
    try {
      const restaurant = await Restaurant.findById(restaurantId);
  
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      const newMenuItem = new Menu({
        name,
        description,
        pricePerUnit,
        is_available,
        restaurant: restaurant._id,
      });
  
      const savedMenuItem = await newMenuItem.save();
  
      res.json({ message: 'Menu item added successfully', menuItem: savedMenuItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const getMenuItems = async (req, res) => {
    const restaurantId = req.user.userId; // Assuming you get the restaurantId from the route parameter
  
    try {
      const menuItems = await Menu.find({ restaurant: restaurantId });
  
      res.json({ menuItems });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  const updateMenuItem = async (req, res) => {
    const { name, description, pricePerUnit, is_available } = req.body;
    const menuItemId = req.params.menuItemId;
  
    try {
      const updatedMenuItem = await Menu.findByIdAndUpdate(
        menuItemId,
        { name, description, pricePerUnit, is_available },
        { new: true }
      );
  
      res.json({ message: 'Menu item updated successfully', menuItem: updatedMenuItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  const deleteMenuItem = async (req, res) => {
    const menuItemId = req.params.menuItemId;
  
    try {
      await Menu.findByIdAndDelete(menuItemId);
  
      res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  
  module.exports = { signup, login, getRestaurant, addMenuItem, getMenuItems, updateMenuItem, deleteMenuItem };