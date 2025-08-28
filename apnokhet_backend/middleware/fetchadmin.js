const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose'); // Import Mongoose
const JWT_SECRET = 'YourSuperSecretString';

const fetchadmin = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);

        // --- ADD THIS VALIDATION BLOCK ---
        // Check if the ID from the token is a valid MongoDB ObjectId
        const { id } = data.user;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(401).send({ error: "Authentication failed: Malformed token" });
        }
        // --- END OF VALIDATION BLOCK ---

        // Now, safely find the user in the database
        const user = await User.findById(id);
        
        if (!user || user.role !== 'admin') {
            return res.status(403).send({ error: "Access denied. Admin privileges required." });
        }

        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Authentication failed: Invalid token." });
    }
};

module.exports = fetchadmin;