'use strict';
//--> all requires 

let express = require('express');
let cors = require('cors');
let app = express();
app.use(cors());
require('dotenv').config();
let pg = require('pg');
let superagent = require('superagent');

// all var 

let PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
let client = new pg.Client(DATABASE_URL);


// Application Middleware using at is //
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));


app.use('/public', express.static('public'));// show css.... sufaring :( 
app.set('view engine', 'ejs');//using file view &engin=>ejs


// ROUTES
app.get('/', handleIndex);
app.get('/searches/new', (req, res) => {
    res.render('./pages/searches/new');
});

app.post('/searches', handleSearches);

app.get('/book/:id', handleBook);


function Book(objbook) {

    if (objbook.volumeInfo.imageLinks === undefined) { //image not found ..
        this.img = 'https://i.imgur.com/J5LVHEL.jpg'
    } else {//if found +check securiity
        if (!(/https:\/\//.test(objbook.volumeInfo.imageLinks.thumbnail))) {
            console.log(objbook.volumeInfo.imageLinks.thumbnail);
            this.img = 'https' + objbook.volumeInfo.imageLinks.thumbnail.slice(4);
            console.log('after', this.img);
        } else {
            this.img = objbook.volumeInfo.imageLinks.thumbnail;
        }
    }
    this.title = objbook.volumeInfo.title;
    this.author = objbook.volumeInfo.authors;
    this.description = objbook.volumeInfo.description ? objbook.volumeInfo.description : "placeholder";
}






function handleIndex(req, res) {
    let selectst = `SELECT title, author, isbn, image_url,description FROM book;`;
    client.query(selectst).then(data => {
        let dataFROMsql = data.rows;
        console.log(dataFROMsql);
        console.log('count ....................');
        let dataCount = data.rowCount;
        console.log(dataCount);
        let arr = dataFROMsql.map(element => {
            console.log('i am inside elements ...  ', element);
            return element;
        });
        res.render('./pages/index', { dataROW: arr, rowCounts: dataCount });
    }).catch(err => {
        console.log(err);
    });
}
//API

function handleSearches(request, response) {
    let titleAuthor = request.body.titleAuthor;
    let filter = request.body.search;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${titleAuthor}+in${filter}`;
    console.log(url);
    superagent.get(url).then(data => {
        let objectApi = data.body.items;
        let bookArr = objectApi.map(element => {
            return new Book(element);
        });
        response.render('./pages/searches/show', { bookObjects: bookArr });

    }).catch(error => {
        console.log('something went wrong ', error);
    });
}

function handleBook(req, res) { //renser single book to viwe-pages-books-detail.ejs
    let sql = 'SELECT * FROM tasks WHERE id=$1;'
    let bookid = [req.params.id];
    return client.query(sql, bookid)
        .then(data => {
            return res.render('./pages/books/detail', { book: data.rows[0] });
        })
        .catch(err => handleError(err, res));
}

client.connect().then((data) => {
    app.listen(PORT, () => {
        console.log(` listing to port ${PORT}`);

    });
}).catch(err => {
    console.log(err);
});