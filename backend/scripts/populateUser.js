// createUsersScript.js
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { hashPassword } = require('../utils/bcryptUtils');
const User = require('../models/user');
const dharwadLatitude = 15.4589;
const dharwadLongitude = 75.0078;

mongoose.connect('mongodb://localhost:27017/test');

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Create and save 25 user records within a 25 km radius from Dharwad district
  const users = [];
  for (let i = 0; i < 25; i++) {
    const randomDistance = Math.random() * 25; // Random distance within 25 km radius
    const randomAngle = Math.random() * 2 * Math.PI; // Random angle

    // Calculate new latitude and longitude
    const newLatitude = dharwadLatitude + (randomDistance / 111.32) * Math.cos(randomAngle);
    const newLongitude = dharwadLongitude + (randomDistance / (111.32 * Math.cos(dharwadLatitude))) * Math.sin(randomAngle);

    const newUser = new User({
      username: faker.person.firstName().toLowerCase(),
      password: await hashPassword('password'),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
      location: {
        type: 'Point',
        coordinates: [newLongitude, newLatitude],
      }
    });

    users.push(newUser);
  }

  try {
    // Save all users to the database
    const savedUsers = await User.insertMany(users);
    console.log('Successfully created and saved 25 users:', savedUsers);
  } catch (error) {
    console.error('Error creating and saving users:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
});