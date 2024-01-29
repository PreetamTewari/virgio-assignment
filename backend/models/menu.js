// src/models/menu.js
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  pricePerUnit: { type: Number, required: true },
  is_available: { type: Boolean, default: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
