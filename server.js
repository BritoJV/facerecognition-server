const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
var cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register.js')
const image = require('./controllers/image.js')
const signIn = require('./controllers/signin.js')
const profile = require('./controllers/profile.js')

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

app.get('/', function (req, res) {
    res.json("There is a response");
})

app.post("/signin", (req, res) => {signIn.handleSignIn(req, res, db, bcrypt) })

app.post("/register", (req, res) => {register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db) })

app.put("/image", (req, res) => {image.handleImage(req, res, db) })
app.post("/imageurl", (req, res) => {image.handleApiCall(req, res) })

app.listen(3000, () => {
    console.log("server is running")
});