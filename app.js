// importing node modules
const express = require("express");

var NewItems = ["Just do it"];
let workList = [];
// init express
const app = express();

app.set('view engine' , 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//handling get request
app.get("/", (req,res)=>{
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    var today = new Date;
    var Day = today.toLocaleDateString(undefined, options)
    res.render("lists", {KindOfDay: Day, itemarr:NewItems})
})


app.get("/work", (req,res)=>{
    res.render("lists", {KindOfDay: "Work List", itemarr : workList})
})

app.post("/", (req , res )=>{
    if(req.body.list === "Work List"){
        workList.push(req.body.NewItem)
        res.redirect("/work")
    }else{
        NewItem = req.body.NewItem;
        NewItems.push(NewItem);
        res.redirect("/")
    }
})

//init the server to 3000 port
app.listen(3000, ()=>{
    console.log("listening to http://localhost:3000/")
})