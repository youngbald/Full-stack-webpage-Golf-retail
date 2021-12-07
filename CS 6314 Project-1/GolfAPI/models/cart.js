var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var Cart = new Schema({
    username: String,
    title: String,
    product_id: String,
    type: String,
    stock: Number,
    price: Number
});

module.exports = mongoose.model('Cart', Cart);