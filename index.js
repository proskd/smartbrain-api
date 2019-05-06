const express = require('express');
const bodyparse = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
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

app.post("/signin", (req, res) => {
    const {email, password} = req.body;
    
    db.select('email', 'hash').from('login')
        .where({
            email: email
        })
        .then((data) => {
            loginInfo = data[0];
            const isValid = bcrypt.compareSync(password, loginInfo.hash);
            if (isValid) {
                return db.select('*').from('users').where({
                    email: email
                }).then(user => {
                    res.json(user[0]);
                }).catch(error => {
                    res.status(400).json('invalid username or password');
                })
            } else {
                res.status(400).json('invalid username or password');
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json('invalid username or password')
        });
});

app.post("/register", (req, res) => {
    const {email, password, name} = req.body;
    const hash = bcrypt.hashSync(password);

    db.transaction((trx) => {
        trx.insert({
            hash: hash,
            email: email
        }).into('login')
        .returning('email')
        .then(loginEmail => {
            console.log("inserted into login", loginEmail);
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            }).then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    }).catch(err => res.status(400).json('Something went wrong'))
});

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