const express = require("express");
const Book = require("../models/book");
// import jsonschema and bookschema 
const jsonschema = require('jsonschema') 
const bookSchema = require('../schemas/bookSchema');
const ExpressError = require("../expressError");

const router = new express.Router();

/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */
// find book per ISBN, not id 
router.get("/:isbn", async function (req, res, next) {
  try {
    // ISBN is passed on req.params
    const book = await Book.findOne(req.params.isbn);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    // validate our book against bookSchema
    const result = jsonschema.validate(req.body, bookSchema) 
    // if not valid... 
    if(!result.valid) {
      // throw error
      let listOfErrors = result.errors.map(error => error.stack)
      let error = new ExpressError(listOfErrors, 400) 
      return next(error)
    }
    // create a book 
    const book = await Book.create(req.body)
    // return book 
    return res.status(201).json({book})

  } catch(err) {
    return next(err) 
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;