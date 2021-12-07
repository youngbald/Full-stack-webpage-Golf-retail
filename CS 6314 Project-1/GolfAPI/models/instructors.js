var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var Instructors = new Schema({
    name: String,
    image: String,
    Experience: Number,
    description: String,
    rate: Number,
    availability: String,
    is_deleted: Boolean
});

module.exports = mongoose.model('Instructors', Instructors);