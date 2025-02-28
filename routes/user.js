const express = require('express');
const User = require("../models/users.model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const middleware=require("../middleware");

const router = express.Router();

router.route("/:username").get(middleware.checkToken,(req, res) => {
    // Find the user by username from the request parameters
    User.findOne({ username: req.params.username })
        .then((result) => {
            // If no user is found, return a 404 response
            if (!result) {
                return res.status(404).json({ msg: "User not found" });
            }

            // Send the user data along with the username in the response
            return res.json({
                data: result,
                username: req.params.username,
            });
        })
        .catch((err) => {
            // Catch any errors and return a 500 error with the message
            return res.status(500).json({ msg: err.message });
        });
});

router.route("/login").post((req, res) => {
    User.findOne({ username: req.body.username })
        .then((result) => {
            // If the user is not found, return a 403 error
            if (!result) {
                return res.status(403).json({ msg: "Either Username is Incorrect" });
            }

            // Check if the password matches
            if (result.password === req.body.password) {
                let token = jwt.sign({ username: req.body.username }, config.key, {
                    expiresIn: "24h",
                });
                // Return the token and success message
                return res.json({ 
                    token: token,
                    msg: "Success",
                });
            } else {
                return res.status(403).json({ msg: "Password is incorrect" }); // Password mismatch
            }
        })
        .catch((err) => {
            // Catch any errors and return a 500 error
            return res.status(500).json({ msg: err.message });
        });
});

router.route("/register").post((req, res) => {
    console.log('inside the register');
    
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    });

    // Save the user to the database
    user
        .save()
        .then(() => {
            console.log("user registered");
            // Send success response once the user is saved
            res.status(200).json("User registered successfully");
        })
        .catch((err) => {
            // Send error response if there is an issue
            res.status(403).json({ msg: err });
        });
});

router.route("/update/:username").patch(middleware.checkToken,(req, res) => {
    User.findOneAndUpdate(
        { username: req.params.username },
        { $set: { password: req.body.password } },
        { new: true } // This ensures the updated document is returned
    )
    .then((result) => {
        if (!result) {
            return res.status(404).json({ msg: "User not found" });
        }

        const msg = {
            msg: "Password successfully updated",
            username: req.params.username,
        };
        return res.json(msg);
    })
    .catch((err) => {
        return res.status(500).json({ msg: err.message });
    });
});

router.route("/delete/:username").delete(middleware.checkToken,(req, res) => {
    User.findOneAndDelete({ username: req.params.username })
        .then((result) => {
            // If no user is found, return a 404 response
            if (!result) {
                return res.status(404).json({ msg: "User not found" });
            }

            // Success response
            const msg = {
                msg: "Username successfully deleted",
                username: req.params.username,
            };
            return res.json(msg);
        })
        .catch((err) => {
            // Catch any errors and return a 500 error
            return res.status(500).json({ msg: err.message });
        });
});

module.exports = router;