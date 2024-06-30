// controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../model/user'); // If using a User model

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

async function login(req, res) {
    // Implement login logic (validate credentials)
    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token: token, user: user });
        });

    } catch (error) {
        console.error('Error in login:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

async function register(req, res) {
    // Implement registration logic (create user)
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("register ::", passwordHash);
        // Create new user
        user = new User({
            name,
            email,
            password: passwordHash,
        });

        await user.save();

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (error) {
        console.error('Error in register:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    login,
    register,
};
