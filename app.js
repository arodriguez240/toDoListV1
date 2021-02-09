const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const app = express();
const prot = 3000;

let items = [];
let workItems = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set("view engine", "ejs");

app.get('/', (req,res) => {

    res.render("list", {listTitle: day, newListItems: items})
})