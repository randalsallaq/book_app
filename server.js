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
let PORT = process.env.PORT || 3000;
// Application Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');//using file view &engin=>ejs

// ROUTES
app.get('/', (req, res) => {
    res.render('./pages/index');
});

app.get('/searches/new', (req, res) => {
    res.render('./pages/searches/new');
});

app.post('/searches', handleSearches);


//API
function Book(objbook) {

    this.img = objbook.volumeInfo.imageLinks;
    this.title = objbook.volumeInfo.title;
    this.author = objbook.volumeInfo.authors;
    this.description = objbook.volumeInfo.description;
    

}

let objectsArray = [];
function handleSearches(request, response) {
    let titleAuthor = request.query.titleAuthor;


    let filter= request.body.search;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${titleAuthor}+in${filter}`;




    superagent.get(url).then(data => {
        let objectApi = data.body.items;
        // console.log(objectApi);
        let bookArr = objectApi.map(element => {
           
            console.log('inside', element);

            return new Book(element);
        });
    
       
            response.render('./pages/searches/show', {bookObjects: bookArr});
          
          
       

    }).catch(error => {

        console.log('something went wrong ', error);
    });


}







// listen to app
app.listen(PORT, () => {
    console.log(` listing to port ${PORT}`);

});