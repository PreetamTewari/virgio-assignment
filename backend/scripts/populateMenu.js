// createMenuItemsScript.js
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Restaurant = require('../models/restaurant');
const Menu = require('../models/menu');

mongoose.connect('mongodb://localhost:27017/bangalore');

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    const restaurantIds = await Restaurant.find().distinct('_id');

    const menuItems = [];
    for (const restaurantId of restaurantIds) {
      for (let i = 0; i < 5; i++) {
        const newMenuItem = new Menu({
          name: `Item ${i + 1}`,
          description: faker.lorem.sentence(),
          pricePerUnit: faker.number.int({ min: 35, max: 500, precision: 0.01 }),
          is_available: faker.datatype.boolean(),
          restaurant: restaurantId,
        });

        menuItems.push(newMenuItem);
      }
    }

    const savedMenuItems = await Menu.insertMany(menuItems);
    console.log('Successfully created and saved menu items:', savedMenuItems);
  } catch (error) {
    console.error('Error creating and saving menu items:', error);
  } finally {
    mongoose.connection.close();
  }
});
