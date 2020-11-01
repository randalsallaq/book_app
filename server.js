'use strict';
//--> all requires 
let express=require('express');
let cors=require('cors');
let app=express();
app.use(cors());
require('dotenv').config();
let pg=require('pg');
let superagent=require('superagent');

// all var 
let PORT=process.env.PORT||3000;

// Application Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');//using file view &engin=>ejs

// ROUTES
app.get('/',(req,res)=>{
    res.render('./pages/index');
});

// listen to app
app.listen(PORT ,() =>{
    console.log(` listing to port ${PORT}`);

});