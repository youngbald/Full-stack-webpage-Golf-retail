var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var Rentals = new Schema({
    brand: String,
    title: String,
    image: String,
    description: String,
    price: Number,
    stock: Number,
    type: String,
    is_deleted: Boolean
});

module.exports = mongoose.model('Rentals', Rentals);