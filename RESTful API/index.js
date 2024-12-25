const express = require("express");
const app= express();
const port = 8080;
const path = require("path");
app.use(express.urlencoded({extended:true}));
app.set("view engine","views");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
const { v4: uuidv4 } = require('uuid');//creating unique ids using npm install uuid

app.use(express.urlencoded({extended:true}));
app.use(express.json());


let posts =[
    {
        id:uuidv4(),//creating unique ids using uuidv4()
        name:"Shubhangi Mashilkar",
        content:"Hardwork is key to success, I got my first break as Software Engineer"
    },
    {
        id:uuidv4(),
        name:"Apna College",
        content:"Delta 5.0 MERN STACK DEVELOPMENT COURSE"
    },
    {
        id:uuidv4(),
        name:"Daksh Sharvil",
        content : "will be successful "
    }
];

//GET data for all post (index of all posts)
app.get("/posts",(req,res)=>{  
    res.render("posts_1.ejs",{posts});
})

//creating new post (create)

app.get("/posts/new",(req,res)=>{
    
    res.render("posts_2.ejs");
})

app.post("/posts",(req,res)=>{
    let newid = uuidv4();
    let {username,textContent} = req.body;
    posts.push({id:newid,name:username,content:textContent});
    res.redirect("http://localhost:8080/posts");

})

//accessing post by id

app.get("/posts/:id",(req,res)=>{
    let {id}=req.params;
    let post = posts.find((po)=>id===po.id);
    res.render("posts_3.ejs",{post});
})

//patch or put request for updating post

app.patch("/posts/:id",(req,res)=>{
    let {id}=req.params;
    let newContent = req.body.content;
    let post = posts.find((po)=>id===po.id);
    post.content = newContent;
    console.log(post);
    console.log(id);
    console.log(newContent);
    res.send("patch is working!!")
})
app.get("/posts/:id/edit",(req,res)=>{
    let {id}=req.params;
    let post = posts.find((po)=>id===po.id);
    res.render("posts_4.ejs",{post});
})





app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})