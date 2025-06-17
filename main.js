const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: true }));

// Home page
app.get('/', (req, res) => {
    res.render('home');
});



// Register page GET route
app.get('/register', (req, res) => {
    res.render('register');
});



let express=require("express");
let mysql =require("./src/config/db");

// Register page POST route (optional, for form submission)

const PORT = process.env.PORT || 6000;
app.get("/", (req, res) => {
    res.send("Server is running!");
});