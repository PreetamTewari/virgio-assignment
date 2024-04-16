// createRestaurantsScript.js
// const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant'); 
const { hashPassword } = require('../utils/bcryptUtils');
const fs = require('fs');
const geohash = require('ngeohash');


const filePath = 'C:/Users/Preetam/Desktop/virgio_mongo/backend/scripts/output.json';
const filePath1 = 'C:/Users/Preetam/Desktop/virgio_mongo/backend/scripts/output1.json';
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
// console.log(jsonData);
// return
const restaurants = []
// const jsonData = [{
//     "name": "Nandhini Deluxe",
//     "address": "304, Opposite Apollo Public School, 100 Feet Ring Road, 4th Phase, 7th Block, Banashankari 3rd Stage, Bangalore,",
//     "location": [
//       15.5,
//       101.0
//     ],
//     "username": "restaurant63",
//     "password": "password"
//   }]


const restaurantPromise = jsonData.map(async data => {
    const hashedPassword = await hashPassword("password");
    console.log(data.location);
    if(data.location[0] > -90.0000 && data.location[0] < 90.0000 && data.location[1] > -180.0000 && data.location[1] < 180.0000){
        const newRestaurant = new Restaurant({
            name: data.name,
            username: data.username,
            password: hashedPassword,
            address: data.address,
            location: {
                type: 'Point',
                coordinates: [data.location[1], data.location[0]],
            },
            geohash: geohash.encode(data.location[1], data.location[0], 7),
            is_open: true,
            opening_hours: "9:00 AM",
            closing_hours: "8:00 PM",
        })
        return newRestaurant;
    }
})

Promise.all(restaurantPromise).then(restaurants => {
    console.log(JSON.stringify(restaurants));
    const writeData = JSON.stringify(restaurants);
    fs.writeFileSync(filePath1, writeData, 'utf8');
})



