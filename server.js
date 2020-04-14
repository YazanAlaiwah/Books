/* eslint-disable no-undef */
'use strict';
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT || 3030;
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const methodOverride = require('method-override');
app.use(express.static('./public'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

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
  client.query(SQL, safeValues).then((data) => {
    let SQL = ' SELECT DISTINCT bookshelf FROM book';
    client.query(SQL).then((data1) => {
      res.render('pages/books/show', {
        book: data.rows[0],
        bookshelfs: data1.rows,
      });
    });
  });
  // .then((data) => res.render('pages/books/show', { book: data.rows[0] }));
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
  let url = `https://www.googleapis.com/books/v1/volumes?q=${type}:${search}`;
  superagent
    .get(url)
    .then((data) => data.body.items.map((book) => new Book(book)))
    .then((books) =>
      res.render('pages/searches/show', { data: books.slice(0, 10) })
    )
    .catch((err) => handelError(err, res));
});
// app.get('/getdata/:id', (req, res) => {
//   let SQL = 'SELECT * FROM book WHERE id=$1';
//   let safeValues = [req.params.id];
//   client.query(SQL, safeValues).then((data1) => {
//     let SQL = ' SELECT DISTINCT bookshelf FROM book';
//     client.query(SQL).then((data) => {
//       res.render('pages/books/edit.ejs', {
//         data: data.rows,
//         data1: data1.rows[0],
//       });
//     });
//   });
// });

app.delete('/books/:id', (req, res) => {
  let SQL = 'DELETE FROM book WHERE id=$1';
  let safeValues = [req.params.id];
  client.query(SQL, safeValues).then((data) => res.redirect('/'));
});

app.put('/books/:id', (req, res) => {
  console.log('dsfdsffs');
  let SQL =
    'UPDATE book SET title=$1, author=$2, isbn=$7, img=$3, description=$4, bookshelf=$5 WHERE id=$6';
  let { title, bookshelf, author, description, img, isbn } = req.body;
  let safeValues = [
    title,
    author,
    img,
    description,
    bookshelf,
    req.params.id,
    isbn,
  ];
  client
    .query(SQL, safeValues)
    .then((data) => res.redirect(`/books/${req.params.id}`));
});

function handelError(err, res) {
  console.log(err);
  res.render('pages/error', {
    img: 'https://blog.hubspot.com/hubfs/HTTP-500-Internal-Server-Error.jpg',
  });
}

function Book(value) {
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
