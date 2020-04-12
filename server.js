/* eslint-disable no-undef */
'use strict';
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT || 3030;
app.use(express.static('./public'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  //   console.log('dsfdsf');
  res.render('pages/index');
});
app.get('/searches', (req, res) => {
  res.render('pages/searches/new.ejs');
});

app.post('/searches', (req, res) => {
  let search = req.body.search;
  let type = req.body.check;
  console.log(search, type);
  let url = `https://www.googleapis.com/books/v1/volumes?q=${type}:${search}`;
  superagent
    .get(url)
    .then((data) => data.body.items.map((book) => new Book(book)))
    .then((books) =>
      res.render('pages/searches/show', { data: books.slice(0, 10) })
    )
    .catch((err) => handelError(err, res));
  //   res.send('ok');
});

function handelError(err, res) {
  console.log(err);
  res.render('pages/error', {
    img: 'https://blog.hubspot.com/hubfs/HTTP-500-Internal-Server-Error.jpg',
  });
}
//   .catch(err => throw new Error('dsfkdsfdshfjk'));
function Book(value) {
  console.log(value.volumeInfo.imageLinks);
  this.title = value.volumeInfo.title || 'Unknown';
  this.author = value.volumeInfo.authors || ['Unknown'];
  this.img = value.volumeInfo.imageLinks
    ? value.volumeInfo.imageLinks.thumbnail ||
      'https://www.zumlume.com/assets/frontend/images/default-book.png'
    : 'https://www.zumlume.com/assets/frontend/images/default-book.png';
  this.description = value.volumeInfo.description || 'NO Description';
}
app.get('*', (req, res) => {
  res.render('pages/error', {
    img:
      'https://qph.fs.quoracdn.net/main-qimg-cefa16b696338ef60eae571cc8a27b10.webp',
  });
});

function errors(err, req, res) {
  res.render('pages/error', {
    img: 'https://blog.hubspot.com/hubfs/HTTP-500-Internal-Server-Error.jpg',
  });
}
// function errors(err, req, res) {
//   res.render('pages/error', {
//     img: 'https://blog.hubspot.com/hubfs/HTTP-500-Internal-Server-Error.jpg',
//   });
// }
app.use((err, req, res) => {
  res.render('pages/error', {
    img: 'https://blog.hubspot.com/hubfs/HTTP-500-Internal-Server-Error.jpg',
  });
});

app.listen(PORT, () => console.log(`hear port-> ${PORT}`));
