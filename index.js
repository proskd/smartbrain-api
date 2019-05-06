const express = require('express');
const bodyparse = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const app = express();

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'proskd',
      password : '',
      database : 'smart-brain'
    }
});

app.use(bodyparse.json());
app.use(cors());

app.get("/", (req, res) => {
    db('users').select('*')
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log("index", err);
        res.status(400).json('something went wrong');
    })
})

app.post("/signin", (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
app.post("/register", (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;

    db.select('*').from('users').where({id: id}).then(user => {
        found = true;
        res.json(user[0]);
    }).catch(error => res.status(400).json("not found"));
});

app.put('/image', (req, res) => {
    const {id} = req.body;

    db('users').where({id: id}).increment('entries', 1).returning('entries')
        .then(entries => {
            res.json(entries);            
        }).catch(error => res.status(400).json("error updating user"));
});

app.listen(3001, () => {
    console.log("app is running");
})