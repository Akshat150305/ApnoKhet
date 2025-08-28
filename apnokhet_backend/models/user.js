const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: ''
    },
    // --- ADDED THIS LINE ---
    role: {
        type: String,
        default: 'user' // Default role for any new user is 'user'
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('user', UserSchema);
module.exports = User;