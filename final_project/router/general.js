const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Input Username AND password" });
  }
  const UsernameExits = users.find(user => user.username === username);
  if (UsernameExits) {
    return res.status(409).json({ message: "Username taken" });
  }
  const newUser = { username, password };
  users.push(newUser);

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({ books }, null, 4));
});
const getallBooks = new Promise((resolve, reject) => {
    if (Object.keys(books).length > 0) {
      resolve(books);
    } else {
      reject(new Error("No books in db"));
    }
  });
public_users.get('/2',function (req, res) {
    //Write your code here
    getallBooks.then(function(books) {
        return res.send(JSON.stringify({ books }, null, 4));
      }).catch(function(err) {
        return res.status(500).json({error: err.message});
      });
    });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const book_need = req.params.isbn;
    res.send(books[book_need]);
 });
 public_users.get('/isbn2/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
  let getBookDetails = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn])
    } else {
      reject(`Book with ISBN ${isbn} not found`)
    }
  })

  getBookDetails.then(
    (details) => {
      return res.json(details)
    },
    (msg) => {
      res.status(404).json({message: msg})
    }
  );
   });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authors = req.params.author;
  const booklist =  Object.values(books);

  const book = booklist.filter((book) => book.author === authors);
  res.status(200).json(book);
});
public_users.get('/author2/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;
  let getBookDetailsAuthor = new Promise((resolve, reject) => {
    if (author) {
      resolve(author)
    } else {
      reject(`Error`)
    }
  })

  getBookDetailsAuthor.then(
    (author) => {
      let existedBooks = Object.entries(books).filter(([isbn, details]) => details.author === author)
      if (existedBooks.length > 0) {
        existedBooks = Object.fromEntries(existedBooks);
        return res.json(existedBooks);
      }
      return res.status(404).json({message: `Book written by ${author} not found`});
    },
    (msg) => {
      res.status(404).json({message: msg})
    }
  )
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booklist = Object.values(books); 
  const book = booklist.filter((book) => book.title === title);
  res.status(200).json(book);
});

public_users.get('/title2/:title',function (req, res) {
    const title = req.params.title;
    let getBookDetailsTitle = new Promise((resolve, reject) => {
      if (title) {
        resolve(title)
      } else {
        reject(`Error`)
      }
    })
  
    getBookDetailsTitle.then(
      (title) => {
        let existedBooks = Object.entries(books).filter(([isbn, details]) => details.title === title)
        if (existedBooks.length > 0) {
          existedBooks = Object.fromEntries(existedBooks);
          return res.json(existedBooks);
        }
        return res.status(404).json({message: `The Book titled ${title} not found`});
      },
      (msg) => {
        res.status(404).json({message: msg})
      }
    )
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const bookisbn = req.params.isbn;
  const book = books[bookisbn];
  res.send(book.reviews);
});

module.exports.general = public_users;
