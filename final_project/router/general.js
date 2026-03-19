const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
    }
  
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
      return res.status(409).json({message: "User already exists"});
    }
  
    users.push({username, password});
    return res.status(200).json({message: "User successfully registered"});
  });
  
  // Get the book list available in the shop using async-await with axios
  public_users.get('/async', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/');
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({message: "Error fetching books", error: error.message});
    }
  });
  
  // Get book details based on ISBN using async-await with axios
  public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      return res.status(200).json(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({message: "Book not found"});
      }
      return res.status(500).json({message: "Error fetching book", error: error.message});
    }
  });
  
  // Get book details based on author using async-await with axios
  public_users.get('/async/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      return res.status(200).json(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({message: "No books found for that author"});
      }
      return res.status(500).json({message: "Error fetching books", error: error.message});
    }
  });
  
  // Get book details based on title using async-await with axios
  public_users.get('/async/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      return res.status(200).json(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({message: "No books found for that title"});
      }
      return res.status(500).json({message: "Error fetching books", error: error.message});
    }
  });
  
  // Get the book list available in the shop
  public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 2));
  });
  
  // Get book details based on ISBN
  public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.send(JSON.stringify(book, null, 2));
    }
  
    return res.status(404).json({message: "Book not found"});
   });
    
  // Get book details based on author
  public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const matchingBooks = {};
  
    bookKeys.forEach((isbn) => {
      if (books[isbn].author === author) {
        matchingBooks[isbn] = books[isbn];
      }
    });
  
    if (Object.keys(matchingBooks).length === 0) {
      return res.status(404).json({message: "No books found for that author"});
    }
  
    return res.send(JSON.stringify(matchingBooks, null, 2));
  });
  
  // Get all books based on title
  public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const matchingBooks = {};
  
    bookKeys.forEach((isbn) => {
      if (books[isbn].title === title) {
        matchingBooks[isbn] = books[isbn];
      }
    });
  
    if (Object.keys(matchingBooks).length === 0) {
      return res.status(404).json({message: "No books found for that title"});
    }
  
    return res.send(JSON.stringify(matchingBooks, null, 2));
  });
  
  //  Get book review
  public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({message: "Book not found"});
    }
  
    return res.send(JSON.stringify(book.reviews || {}, null, 2));
  });
  
  module.exports.general = public_users;
  