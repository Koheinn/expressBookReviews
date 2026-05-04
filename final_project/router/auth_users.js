const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Login route with JWT returned
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "access", { expiresIn: "1h" });
        req.session.authorization = { token, username };
        return res.status(200).json({ message: "Logged in successfully", token });
    }
    return res.status(401).json({ message: "Invalid credentials" });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization?.username;
    if (!username) return res.status(401).json({ message: "User not logged in" });

    const isbn = req.params.isbn;
    const review = req.query.review;
    if (!review) return res.status(400).json({ message: "Review text required" });

    if (!books[isbn].reviews) books[isbn].reviews = {};
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization?.username;
    if (!username) return res.status(401).json({ message: "User not logged in" });

    const isbn = req.params.isbn;
    if (books[isbn].reviews?.[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted" });
    }
    return res.status(404).json({ message: "No review found for this user" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;