// load the package
const express=require("express");
const mongoose=require("mongoose");

const todo=require("./model/todo");
const cors =require ("cors");
app.use(cors());

//create the application object
const app=express();   
app.use(express.json());
                        //both the steps used to create the server

mongoose.connect("mongodb://localhost:27017/todoDB")
       .then(()=>{console.log(" connected to database")})
       .catch((err)=>{console.log(err)});

//CRUD operation
 app.get("/todolist",async(req,res)=>{
       const todoget=await todo.find();
       res.json(todoget);
 });

app.post("/todolist",async (req,res)=>{
       const todopost=await new todo({text:req.body.text}).save();

});

app.put("/todolist/:id",async(req,res)=>{
       const todoput=await todo.findByIdAndUpdate(req.params.id,
                         {completed:req.body.completed , updatedAt:req.body.updatedAt},
                         {new:true},
       );
       res.json(todoput);
});

app.delete("/todolist/:id",async(req,res)=>{
       await todo.findByIdAndDelete(req.params.id);
       res.json({message:"task deleted"});
});


//start the server
app.listen(3000,()=>{console.log("server started")});