const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require('jsonwebtoken');

const secret = "mysecretkey";


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Create new user object
  const user = {
    id: users.length + 1,
    username,
    password
  };

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
      return res.status(200).json({message: "User successfully registred. Now you can login", token});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  await res.send(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn

  const keys = Object.keys(books)

  const filteredBooks = keys.filter((key) => key === isbn).map(key => books[key]);

  await res.send(filteredBooks)
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author

  const filteredBooks = Object.values(books).filter((book) => book.author === author);
  await res.send(filteredBooks)
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title

  const filteredBooks = Object.values(books).filter((book) => book.title === title);
  await res.send(filteredBooks)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn

  const keys = Object.keys(books)

  const filteredBooks = keys.filter((key) => key === isbn).map(key => books[key].reviews);
  res.send(filteredBooks)
});

module.exports.general = public_users;
