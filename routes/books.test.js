// config NODE_ENV to "test" for testing  
process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require('../app') 
const db = require("../db");
const Book = require("../models/book");

describe('Test class Book', () => {
    beforeEach(async function () {
      await db.query('DELETE FROM books');
      let b = await Book.create({
        isbn: "0123456789",
        amazon_url: "https://amazon.com",
        author: "Test",
        language: "english",
        pages: 100,
        publisher: "Test Publisher",
        title: "Test of Tests",
        year: 2021
      });
    })

    // test
    test('can create a book', async () => {
        let b = await Book.create({
            isbn: "1234567891",
            amazon_url: "https://amazon.com",
            author: "Test",
            language: "english",
            pages: 400,
            publisher: "Test Publisher",
            title: "Test of Tests 2",
            year: 2021,
        });
        expect(b.isbn).toBe('1234567891')      
        expect(b.title).toBe('Test of Tests 2')
    })    
})

describe('GET /books', () => {
    test('Get all books', async () => {
        const response = await request(app)
            .get('/books') 
        const books = response.body.books 
        expect(response.statusCode).toBe(200)
        expect(books[0]).toHaveProperty("isbn") 
    })
})

describe('GET /books/isbn', () => {
    test('Get a book by ISBN', async () => {
        const response = await request(app).get('/books/1234567891')
        expect(response.status).toBe(200) 
        expect(response.body.book).toHaveProperty("title")
    })
})

describe('POST /books', () => {
    test('Create a new book', async () => {
        const response = await request(app)
            .post('/books')
            .send({
                isbn: "234567891011",
                amazon_url: "https://amazon.com",
                author: "John Flork",
                language: "english",
                pages: 430,
                publisher: "Melody Publishers",
                title: "Test The Art",
                year: 1977
            })
        expect(response.statusCode).toBe(201)
        expect(response.body.book).toHaveProperty('isbn')
    })
})

describe('PUT /books/isbn', () => {
    test('Update a book', async () => {
        const response = await request(app) 
            .put(`/books/1234567891`)
            .send({
                isbn: "1234567891",
                amazon_url: "https://amazon.com",
                author: "Woz Niaki",
                language: "english",
                pages: 333,
                publisher: "Test Publisher",
                title: "Test of Failing Tests",
                year: 2021,
            })
        expect(response.status).toBe(200)
    })
})

describe('DELETE /books/isbn', () => {
    test('Delete a book by ISBN', async () => {
        const response = await request(app)
            .delete(`/books/1234567891`)
        expect(response.status).toBe(200) 
        expect(response.body).toEqual({message: "Book deleted"})
    })
})


// close database after all tests
afterAll(async function() {
    await db.end()
}); 
