const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', function (req, res) {
    const { username, password } = req.body; // Get username and password from request body
  
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if username already exists
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    // Add the new user to the users array
    users.push({ username, password });
  
    // Respond with a success message
    return res.status(201).json({ message: "User registered successfully" });
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks
        .then((books) => {
            return res.status(200).send(books);
        })
        .catch((error) => {
            return res.status(500).json({ message: "Error getting book list" });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Get ISBN from request parameters

    // Create a promise to retrieve book details
    let getBookDetails = new Promise((resolve, reject) => {
        // Check if the provided ISBN exists in the 'books' object
        if (!books.hasOwnProperty(isbn)) {
            reject({ status: 404, message: "Book not found" });
        } else {
            // Get the book details using the provided ISBN
            const book = books[isbn];
            resolve(book);
        }
    });

    // Handle the promise resolution
    getBookDetails
        .then((book) => {
            // Send the book details as a response
            return res.status(200).json({ book: book });
        })
        .catch((error) => {
            // Handle errors
            return res.status(500).json({ message: "Error getting the book by isbn" });
        });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // Get author from request parameters

    // Create a promise to retrieve books by author
    let getBooksByAuthor = new Promise((resolve, reject) => {
        // Find books based on the author
        const booksByAuthor = Object.values(books).filter(book => book.author === author);
        
        if (booksByAuthor.length === 0) {
            reject({ status: 404, message: "No books found for the provided author" });
        } else {
            resolve(booksByAuthor);
        }
    });

    // Handle the promise resolution
    getBooksByAuthor
        .then((booksByAuthor) => {
            // Send the books by the author as a response
            return res.status(200).json({ books: booksByAuthor });
        })
        .catch((error) => {
            return res.status(500).json({ message: "Error getting the book by author" });
        });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; // Get title from request parameters

    // Create a promise to retrieve books by title
    let getBooksByTitle = new Promise((resolve, reject) => {
        // Find books based on the title
        const booksByTitle = Object.values(books).filter(book => book.title === title);

        if (booksByTitle.length === 0) {
            reject({ status: 404, message: "No books found with the provided title" });
        } else {
            resolve(booksByTitle);
        }
    });

    // Handle the promise resolution
    getBooksByTitle
        .then((booksByTitle) => {
            // Send the books with the provided title as a response
            return res.status(200).json({ books: booksByTitle });
        })
        .catch((error) => {
            return res.status(500).json({ message: "Error getting the book by title" });
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Get ISBN from request parameters
  
    // Check if the provided ISBN exists in the 'books' object
    if (!books.hasOwnProperty(isbn)) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Get the reviews associated with the book corresponding to the ISBN
    const reviews = books[isbn].reviews;
  
    // Send the reviews as a response
    return res.status(200).json({ reviews: reviews });
  });

module.exports.general = public_users;
