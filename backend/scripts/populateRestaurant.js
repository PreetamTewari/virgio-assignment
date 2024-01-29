// createRestaurantsScript.js
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Restaurant = require('../models/restaurant'); // Adjust the path based on your project structure
const { hashPassword } = require('../utils/bcryptUtils');

// Dharwad district's coordinates (central point)
const dharwadLatitude = 15.4589;
const dharwadLongitude = 75.0078;

mongoose.connect('mongodb://localhost:27017/test');

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Create and save 1000 restaurant records within a 25 km radius from Dharwad district
  const restaurants = [];
  for (let i = 0; i < 10000; i++) {
    const randomDistance = Math.random() * 25; // Random distance within 25 km radius
    const randomAngle = Math.random() * 2 * Math.PI; // Random angle

    // Calculate new latitude and longitude
    const newLatitude = dharwadLatitude + (randomDistance / 111.32) * Math.cos(randomAngle);
    const newLongitude = dharwadLongitude + (randomDistance / (111.32 * Math.cos(dharwadLatitude))) * Math.sin(randomAngle);

    const newRestaurant = new Restaurant({
      name: faker.company.name() + " Restaurant",
      username: `restaurant${i + 1}`,
      password: await hashPassword("password"),
      address: faker.location.streetAddress(),
      location: {
        type: 'Point',
        coordinates: [newLongitude, newLatitude],
      },
      is_open: faker.datatype.boolean(),
      opening_hours: "9:00 AM",
      closing_hours: "8:00 PM",
    });

    restaurants.push(newRestaurant);
  }

  try {
    // Save all restaurants to the database
    const savedRestaurants = await Restaurant.insertMany(restaurants);
    console.log('Successfully created and saved 1000 restaurants:', savedRestaurants);
  } catch (error) {
    console.error('Error creating and saving restaurants:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
});
