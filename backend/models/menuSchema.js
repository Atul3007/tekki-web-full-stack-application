const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }]
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
