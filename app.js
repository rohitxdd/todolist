// importing node modules
const express = require("express");
const mongoose = require("mongoose");


//mongoose connect
mongoose.connect("mongodb://localhost:27017/toDoListDB")

//creating schema
const toDoSchema = {
    name: {
        type: String,
        required: true
    }
}

// mongoose model
const Items = new mongoose.model("Item", toDoSchema);

// inserting default Items
const item1 = new Items({
    name: "Welcome to to-do-list"
})

const item2 = new Items({
    name: "Hit the + button to add new item"
})

const item3 = new Items({
    name: "<-- Hit this to delete an item"
})

const defaultItem = [item1, item2, item3];

const app = express();
app.set('view engine' , 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//handling get request
app.get("/", (req,res)=>{
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    var today = new Date;
    var Day = today.toLocaleDateString(undefined, options)
    Items.find({}, function(err, itemarr){
        if(err){
            console.log(err);
        }else if(itemarr.length === 0){
            Items.insertMany(defaultItem, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("default items inserted");
                }
            })
            res.redirect("/")
        }else{
            res.render("lists", {KindOfDay: Day, itemarr:itemarr})
        }
        
    })
    
})


app.post("/", (req , res )=>{
    if (req.body.NewItem != ""){
        let newItemString = new Items({
            name: req.body.NewItem
        })
        newItemString.save()
        res.redirect("/")
    }else{
        res.redirect("/")
    }

})


app.post("/delete", function(req,res){
    console.log(req.body.checkbox)
    Items.deleteOne({_id:req.body.checkbox}, (err)=>{
        if(err){
            console.log(err)
        }
    })
    res.redirect("/")
})

//init the server to 3000 port
app.listen(3000, ()=>{
    console.log("listening to http://localhost:3000/")
})