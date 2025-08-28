const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServiceSchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true }
});

const Service = mongoose.model('service', ServiceSchema);
module.exports = Service;