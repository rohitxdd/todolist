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

const listSchema = {
    name: String,
    listItem: [toDoSchema]
}

const List = new mongoose.model("list", listSchema)


const app = express();
app.set('view engine' , 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//handling get request
app.get("/", (req,res)=>{
    // var options = { weekday: 'long', month: 'long', day: 'numeric' };
    // var today = new Date;
    // var Day = today.toLocaleDateString(undefined, options)
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
            res.render("lists", {KindOfDay: "Today", itemarr:itemarr})
        }
        
    })
    
})


app.post("/", (req , res )=>{
    if (req.body.NewItem != ""){
        let itemName = req.body.NewItem;
        let listName = req.body.list;


        const item = new Items({
            name:itemName
        })
        if(listName=="Today"){
            item.save()
            res.redirect("/")
        }else{
            List.findOne({name:listName}, (err, FoundItem)=>{
                if(!err){
                    // console.log(FoundItem)
                    FoundItem.listItem.push(item)
                    FoundItem.save()
                    res.redirect("/"+listName)
                }
            })
        }

    }else if(req.body.NewItem==""){
        if(req.body.list=="Today"){
            res.redirect("/")
        }else{
            res.redirect("/"+req.body.list)
        }
    }

})


app.post("/delete", function(req,res){
    let listName = req.body.check_id
    let obj_id = req.body.checkbox
    let NewArr = []
    if (listName == "Today"){
        Items.deleteOne({_id:req.body.checkbox}, (err)=>{
            if(err){
                console.log(err)
            }
       })
       res.redirect("/")
    }else{
        List.findOne({name:listName}, (err, returnList)=>{
            returnList.listItem.forEach(el=>{
                // console.log(el._id)
                // console.log(el._id.toString())
                if (el._id.toString() != obj_id){
                  NewArr.push(el)
                }
            })
            List.findOneAndUpdate({name:listName}, {listItem:NewArr}, {
                returnOriginal: false
              }, (err, result=>{
                  if(!err){
                      res.redirect("/"+listName)
                  }
              }));
        })

    }
})


//express routes
app.get("/:customListName", (req,res)=>{
    if(req.params.customListName !== "favicon.ico"){
    List.findOne({name:req.params.customListName}, function(err, listArr){
        if (!err){
            if(!listArr){
                const listItems = new List({
                    name: req.params.customListName,
                    listItem: defaultItem
                })
                listItems.save(()=>res.redirect("/"+req.params.customListName))    
            }else{
                res.render("lists", {KindOfDay:listArr.name, itemarr:listArr.listItem})
            }
        }
    })
    }
})


//init the server to 3000 port
app.listen(3000, ()=>{
    console.log("listening to http://localhost:3000/")
})