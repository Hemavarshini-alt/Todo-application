// load the package
const express=require("express");
const mongoose=require("mongoose");
const todo = require("./model/todo");

//create the application object
const app=express();   
                        //both the steps used to create the server

mongoose.connect("mongodb://localhost:27017/todoDB")
       .then(()=>{console.log("connected to database")})
       .catch((err)=>{console.log(err)});

//CRUD operation
 app.get("/",(req,res)=>{});

app.post("/",(req,res)=>{});

app.post("//:id",(req,res)=>{});

app.delete("//:id",(req,res)=>{});


//start the server
app.listen(3000,()=>{console.log("server started")});
