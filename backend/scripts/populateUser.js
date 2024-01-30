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

  const users = [];
  for (let i = 0; i < 25; i++) {
    const randomDistance = Math.random() * 25; 
    const randomAngle = Math.random() * 2 * Math.PI; 

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
    const savedUsers = await User.insertMany(users);
    console.log('Successfully created and saved 25 users:', savedUsers);
  } catch (error) {
    console.error('Error creating and saving users:', error);
  } finally {
    mongoose.connection.close();
  }
});