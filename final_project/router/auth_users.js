const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username exists and the password matches
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
    // Generate JWT token
    const token = jwt.sign({ username: username }, 'fingerprint_customer', { expiresIn: '1h' });

    // Store the token in the session
    req.session.authorization = { accessToken: token };

        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params; // Get ISBN from request parameters
    const { review } = req.query; // Get review from request query
    const username = req.session.authorization.username; // Get username from session

    // Check if review is provided in the query
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Find the index of the review for the current user and ISBN
    const index = users.findIndex(user => user.username === username && user.reviews && user.reviews[isbn]);

    // If review exists for the current user and ISBN, modify the existing review
    if (index !== -1) {
        users[index].reviews[isbn] = review;
        return res.status(200).json({ message: "Review updated successfully" });
    }

    // If no review exists for the current user and ISBN, add a new review
    users.push({ username, reviews: { [isbn]: review } });
    return res.status(200).json({ message: "Review added successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params; // Get ISBN from request parameters
    const username = req.session.authorization.username; // Get username from session

    // Find the index of the review for the current user and ISBN
    const index = users.findIndex(user => user.username === username && user.reviews && user.reviews[isbn]);

    // If review exists for the current user and ISBN, delete the review
    if (index !== -1) {
        delete users[index].reviews[isbn];
        return res.status(200).json({ message: "Review deleted successfully" });
    }

    // If no review exists for the current user and ISBN, return a message
    return res.status(404).json({ message: "Review not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
