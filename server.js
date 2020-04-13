/* eslint-disable no-undef */
'use strict';
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT || 3030;
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
app.use(express.static('./public'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.post('/books', (req, res) => {
  let { title, img, author, description, bookshelf, isbn } = req.body;
  let SQL =
    'INSERT INTO book (title,author,img,description,bookshelf,isbn) VALUES ($1,$2,$3,$4,$5,$6)';
  let safeValues = [title, author, img, description, bookshelf, isbn];
  client.query(SQL, safeValues).then(() => {
    res.redirect('/');
  });
});

app.get('/books/:id', (req, res) => {
  let SQL = `SELECT * FROM book WHERE id = $1`;
  let safeValues = [req.params.id];
  client
    .query(SQL, safeValues)
    .then((data) => res.render('pages/books/show', { book: data.rows[0] }));
  // console.log(req.params.id, 'sdfdsfds');
});
app.get('/', (req, res) => {
  let SQL = 'SELECT * FROM book';
  client
    .query(SQL)
    .then((data) => res.render('pages/index', { books: data.rows }));
});
app.get('/searches', (req, res) => {
  res.render('pages/searches/new.ejs');
});

app.post('/searches', (req, res) => {
  let search = req.body.search;
  let type = req.body.check;
  // console.log(search, type);
  let url = `https://www.googleapis.com/books/v1/volumes?q=${type}:${search}`;
  superagent
    .get(url)
    .then((data) => data.body.items.map((book) => new Book(book)))
    .then((books) =>
      res.render('pages/searches/show', { data: books.slice(0, 10) })
    )
    .catch((err) => handelError(err, res));
});

function handelError(err, res) {
  console.log(err);
  res.render('pages/error', {
    img: 'https://blog.hubspot.com/hubfs/HTTP-500-Internal-Server-Error.jpg',
  });
}
function Book(value) {
  console.log(value.volumeInfo.categories || ['Unknown'], 'sdsdsd');
  this.title = value.volumeInfo.title || 'Unknown';
  this.author = value.volumeInfo.authors || ['Unknown'];
  this.img = value.volumeInfo.imageLinks
    ? value.volumeInfo.imageLinks.thumbnail ||
      'https://www.zumlume.com/assets/frontend/images/default-book.png'
    : 'https://www.zumlume.com/assets/frontend/images/default-book.png';
  this.description = value.volumeInfo.description || 'NO Description avilebel';
  this.bookshelf = value.volumeInfo.categories || ['Unknown'];
  this.ISBN = value.volumeInfo.industryIdentifiers || [
    { identifier: 'no ISBN' },
  ];
}
app.get('*', (req, res) => {
  res.render('pages/error', {
    img:
      'https://qph.fs.quoracdn.net/main-qimg-cefa16b696338ef60eae571cc8a27b10.webp',
  });
});

function errors(err, req, res) {
  // console.log(err)
  res.render('pages/error', {
    img: 'https://blog.hubspot.com/hubfs/HTTP-500-Internal-Server-Error.jpg',
  });
}

app.use((err, req, res) => {
  // console.log(
  //   err,
  //   'dsfffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  // );
  // res.send(err)
  // res.render('pages/error', {
  //   img: 'https://blog.hubspot.com/hubfs/HTTP-500-Internal-Server-Error.jpg',
  // });
});

client
  .connect()
  .then(() => app.listen(PORT, () => console.log(`hear port-> ${PORT}`)));
