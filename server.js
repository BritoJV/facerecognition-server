const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
var cors = require('cors');
const knex = require('knex');

app.use(express.json());
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'Post159753',
      database : 'smartBrain'
    }
});

// db.select('*').from('users').then(data =>{
//     console.log(data);
// });

// const database = {
//     users: [
//         {
//             id:"123",
//             name:'John',
//             email:'john@gmail.com',
//             password:'cookies',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id:"129",
//             name:'Sally',
//             email:'sally@gmail.com',
//             // password:'bananas',
//             entries: 0,
//             joined: new Date()
//         }
//     ],
//     login:[
//         {
//             id: '987',
//             hash:'',
//             email:'john@gmail.com'
//         }
//     ]

// }

app.get('/', function (req, res) {
    res.json("There is a response");
})

app.post("/signin", (req, res) =>{
    // res.json('Signed in')
    // if (req.body.email === database.users[0].email &&
    //     req.body.password === database.users[0].password){
    //         res.json(database.users[0])
    // }
    // else{
    //     res.status(400).json("Error logging in")
    // }
    db.select('email','hash').from('login').where({email:req.body.email})
    .then(loginData =>{
        if (bcrypt.compareSync(req.body.password, loginData[0].hash)){
            db.select('*').from('users').where({email:req.body.email})
            .then(user =>{
                res.json(user[0])
            })
            .catch(err => res.status(400).json("Unable to find user"))
        }
        else{
            res.status(400).json("Error logging in 1")
        }
    })
    .catch(err => res.status(400).json("Error logging in 2"))
})

app.post("/register", (req, res) =>{
    // res.json('New user added')
    const {email, password, name} = req.body;
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash)
    // database.users.push({
    //     id:"121",
    //     name:name,
    //     email:email,
    //     password:password,
    //     entries: 0,
    //     joined: new Date()
    // })
    const hash = bcrypt.hashSync(password);
    db.transaction(trx =>{
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user =>{
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {res.status(400).json('Unable to register')})
    // db('users')
    //     .returning('*')
    //     .insert({
    //         email: email,
    //         name: name,
    //         joined: new Date()
    //     })
    //     .then(user => res.json(user[0]))
    //     .catch(err => {res.status(400).json('Unable to register')})
    // res.json(db.users[database.users.length-1])
})

app.get('/profile/:id', function (req, res) {
    const {id} = req.params;
    // let found = false;
    // database.users.forEach(user =>{
    //     if (user.id === id){
    //         found = true
    //         return res.json(user)
    //     }
    // })
    // if (!found){
    //     return res.status(404).json("User not found")
    // }
    db.select('*').from('users').where({id:id}).then(user => {
        if (user.length){
            res.json(user[0])
        }
        else{
            res.status(404).json("User not found")
        }
    })

})

app.put("/image", (req, res) =>{
    const {id} = req.body;
    // let found = false;
    // database.users.forEach(user =>{
    //     if (user.id === id){
    //         found = true
    //         user.entries++;
    //         return res.json(user.entries)
    //     }
    // })
    // if (!found){
    //     return res.status(404).json("User not found")
    // }
    db('users').where({id:id})
    .increment('entries',1)
    .returning('entries')
    .then(response =>{
        res.json(response[0].entries)
    })
    .catch(err => res.status(400).json("Unable to update entries count"))
})

app.listen(3000, () => {
    console.log("server is running")
});

/* requests
/               --> res = this is working
/signin         --> POST user data = SUCESS/FAIL
/register       --> POST = user/ERROR
/prof/:userid   --> GET = user
/image          --> PUT = user
*/

/*
Synchronous
var hash = bcrypt.hashSync("bacon");

bcrypt.compareSync("bacon", hash); // true
bcrypt.compareSync("veggies", hash); // false
____________
Assynchrnous
bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
});

// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});
*/