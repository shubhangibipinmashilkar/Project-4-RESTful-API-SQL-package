const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
var methodOverride = require('method-override')
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));



const port = 8080;

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        database : 'delta',
        password: '123456',
    }
);
function getRandomUser() {
    // return {
    //   id: faker.string.uuid(),
    //   username: faker.internet.username(), // before version 9.1.0, use userName()
    //   email: faker.internet.email(),
    //   password: faker.internet.password(),
    // }; ---returns object with key value
    return [ //--- returns array with values only
        faker.string.uuid(),
        faker.internet.username(), // before version 9.1.0, use userName()
        faker.internet.email(),
        faker.internet.password()
    ];
  }

  //HOME PAGE
  app.get("/",(req,res)=>{
    let q=`SELECT COUNT(*) FROM user`;
    try{
        connection.query(q,(err,result)=>{
           if(err) throw err;
            let count=(result[0]["COUNT(*)"]);
           res.render("home.ejs",{count});
        });
    }catch{
        res.send("some DB issue found");
        console.log(err);
    }
});

// SHOW ALL USERS' id, name, email (not password because it's sensitive info)

app.get("/user",(req,res)=>{
    let q = `SELECT * FROM user`;
    try{
        connection.query(q,(err,users)=>{
            if(err) throw err;
            // res.send(users);
            res.render("showAllUsers.ejs",{users});
        })
    }catch(err){
        console.log(err);
    }
})

//EDIT username
// app.get("/user/:id/edit",(req,res)=>{
//     let {id} = req.params;
//     let q =`SELECT * FROM user WHERE id = "${id}"`;
//     try{
//     if(err) throw err;
//     connection.query(q,(err,result)=>{
//         console.log(result);
//         res.render("edit.ejs");
//     })

//    }catch(err){
//     console.log(err);
//    }
    
// })

app.get("/user/:id/edit",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try{
        
        connection.query(q,(err,result)=>{
            if(err)throw err;
            let user = result[0];
            res.render("edit.ejs",{user});
        })

    }catch(err){
        console.log(err);
    }
}
)
//UPDATE username
app.patch("/user/:id",(req,res)=>{
    let { id } = req.params;
    let {password : formPassword, username : formUsername}=req.body;
    let q1 = `SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q1,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            //res.send(user);
            if(formPassword!=user.password){
                res.send("INVALID PASSWORD !! ");
            }else{
                let q2=`UPDATE user SET username='${formUsername}' WHERE id = '${id}'`;
                connection.query(q2,(err,result)=>{
                    if(err)throw err;
                    res.redirect("/user");
                })
            }

        })
    }catch(err){
        console.log(err);
    }
})
 


//INSERT new user

app.get("/user/new",(req,res)=>{
    let id = uuidv4();
    console.log(id);
    res.render("new.ejs",{id});
})

app.post("/user/:id/",(req,res)=>{
    let {id}=req.params;
    let {username,email,password}=req.body;
    console.log(username,email,password);
    let q3 = `INSERT INTO user (id,username,email,password) VALUES ('${id}','${username}','${email}','${password}')`;
    try{
        connection.query(q3,(err,result)=>{
            if(err) throw err;
            res.redirect('/user');
        })

    }catch(err){
        console.log(err);
    }
})

app.delete("/user/:id",(req,res)=>{
    let { id } = req.params;
    let q4 = `DELETE FROM user WHERE id = '${id}'`;
    try{
        connection.query(q4,(err,result)=>{
            console.log(result);
            res.redirect("/user");
        })
    }catch(err){
        console.log(err);
    }
})

// let qry = "SHOW TABLES";
// try{
// connection.query(qry,(err, results)=>{
// if(err) throw err;
// console.log(results);
// console.log(results.length);
// console.log(results[0]);
// console.log(results[1]);
// })
// }catch(err){
//     console.log(err);
// }

//INSERT multiple values
// let q = "INSERT INTO user (id,username,email,password) VALUES ?";
// let users=[['103','123_def','def@gmail.com','passdef'],['102','123_pqr','pqr@gmail.com','passpqr']]; //creating array of array

//insert single value
// let q = "INSERT INTO user (id,username,email,password) VALUES (?,?,?,?)"; //? is called place holder for insering dynamically
// let user1=['103','123_def','def@gmail.com','passdef'];

//INSERT 100 values to table using faker
// let q = "INSERT INTO user (id, username,email,password) VALUES ?";
// let users=[];

//  for(let i=1;i<=100;i++){
//    // getRandomUser();
//   users.push(getRandomUser());
// }



//INSERT data in bulk using @faker-js/faker



app.listen(port,()=>{
    console.log(`SERVER IS LISTENING ON PORT ${port}`);
})

//   console.log(getRandomUser());

