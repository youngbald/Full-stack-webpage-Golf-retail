var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var RangeBalls = new Schema({
    title: String,
    quantity: String,
    image: String,
    type: String,
    price: Number,
    is_deleted: Boolean
});

module.exports = mongoose.model('RangeBalls', RangeBalls);