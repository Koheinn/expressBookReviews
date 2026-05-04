const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password are required" });
    if (users.find(user => user.username === username)) return res.status(409).json({ message: "Username already exists" });
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get all books
public_users.get('/', async (req,res) => {
    res.json(books);
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) return res.json(book);
    return res.status(404).json({ message: "Book not found" });
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    const result = Object.values(books).filter(book => book.author.toLowerCase() === author);
    if (result.length > 0) return res.json(result);
    return res.status(404).json({ message: "No books found for this author" });
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    const result = Object.values(books).filter(book => book.title.toLowerCase() === title);
    if (result.length > 0) return res.json(result);
    return res.status(404).json({ message: "No books found with this title" });
});

// Get book reviews by ISBN
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) return res.json(book.reviews);
    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;