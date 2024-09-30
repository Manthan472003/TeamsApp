const User = require('../../Database/Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const express = require('express');

const app = express();
app.use(cookieParser());


// Create a new user (with email existence check)
const createUser = async (req, res) => {
    try {
        const { userName, email, password, userType } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'User name, email, and password are required.' });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({ userName, email, password: encryptedPassword, userType });

        // Generating Token with user details
        const token = jwt.sign(
            { id: newUser.id, userName: newUser.userName, email: newUser.email, userType: newUser.userType },
            'shhhh',
            { expiresIn: "2h" }
        );

        // Save the token in the database
        newUser.token = token;
        await newUser.save(); // Make sure to save the updated user

        newUser.password = undefined; // Do not return the password

        return res.status(201).json({ message: 'User created successfully.', newUser });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating user.', error });
    }
};



// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving users.', error });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving user.', error });
    }
};

// Update user by ID (with email existence check)
const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { userName, email, password, userType } = req.body;

        // Check if the user exists
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the email is provided and validate it
        if (email) {
            // Check if the new email already exists (and ensure it's not the same user's current email)
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser && existingUser.id !== id) {
                return res.status(409).json({ message: 'Email already exists.' });
            }
            user.email = email; // Update the email only if provided
        }

        // Update fields only if they are provided
        if (userName) user.userName = userName;
        if (userType) user.userType = userType;

        // Hash the password if it has been updated
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Generate a new token with updated user details
        const token = jwt.sign(
            { id: user.id, userName: user.userName, email: user.email, userType: user.userType },
            'shhhh',
            { expiresIn: "2h" }
        );

        // Save the token in the database
        user.token = token;

        // Save the updated user
        await user.save();

        return res.status(200).json({ message: 'User updated successfully.', user });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user.', error });
    }
};



// Delete user by ID
const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await user.destroy();
        return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting user.', error });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });

        // What if user does not exist
        if (!user) {
            return res.status(400).json({ message: 'Incorrect email.' });
        }

        // Match Password
        if (await bcrypt.compare(password, user.password)) {
            // Generating Token with user details
            const token = jwt.sign(
                { id: user.id, userName: user.userName, email: user.email, userType: user.userType },
                'shhhh',
                { expiresIn: "2h" }
            );

            // Save the token in the database
            user.token = token;
            await user.save(); // Save the updated user with token

            user.password = undefined; // Do not return the password

            // Send token in the user's cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            return res.status(200).cookie("token", token, options).json({
                success: true,
                token,
                user: {
                    userId: user.id,
                    userName: user.userName,
                    userType: user.userType
                }
            });
        } else {
            return res.status(400).json({ message: 'Incorrect password.' });
        }

    } catch (error) {
        return res.status(500).json({ message: 'Error logging in', error });
    }
};




module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    loginUser
};