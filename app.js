const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require('mongoose');
const _ = require('lodash');
const port = 3000;



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
// Data Base
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todo List"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

// Data Base **END**
app.set("view engine", "ejs");

app.get('/', (req,res) => {


    

    Item.find({}, (err, foundItems) => {

        if(foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) =>{
                if (err) {
                    console.log(err);
                } else {
                    console.log("Succefully saved default items to DB");
                }
            });
            res.redirect('/');
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });
});

app.get("/:customListName", (req,res) => {
    const customList = _.capitalize(req.params.customListName);

    List.findOne({name: customList}, (err, foundList) =>{
        if (! err){
            if (!foundList){
                //Create a new list
                const list = new List({
                    name: customList,
                    items: defaultItems
                });
                list.save();
                res.redirect('/' + customList);
            } else {
                // show existing list
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
            }
        }
    });
});

app.post('/', (req,res) => {
    const itemName = req.body.newItem;

    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "Today"){
    item.save();
    res.redirect('/');
    } else {
        List.findOne({name: listName}, (err, foundList) =>{
            foundList.items.push(item);
            foundList.save();
            res.redirect('/' + listName);
        });
    }
});

app.post('/delete', (req,res) => {
    const checkedItemId = req.body.deleteItem;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, (err) =>{
            if (!err) {
                console.log("Successfully deleted checked item.");
                res.redirect('/');
            }
        });
    } else {
        List.findOne({name: listName}, (err, foundList)=>{
            if (err) { console.log(err)
            } else {
                foundList.items.pull(checkedItemId);
                foundList.save();
                res.redirect("/"+listName);
            }
        });
    }
});



app.post('/work', (req,res) => {
    let item = req.body.newItem;

    workItems.push(item);

    res.redirect('/work');
});

app.get('/about', (req,res) => {
    res.render("about");
});

app.listen (port, () => {
    console.log(`You are listening on port ${port}`);
});