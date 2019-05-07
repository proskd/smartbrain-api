const express = require('express');
const bodyparse = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const {check} = require('express-validator/check');

const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');
const config = require('./config.js');

const app = express();

const db = knex(config.getDBConfig(process.env.SERVER_ENV || 'dev'));

app.use(bodyparse.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json("I'm alive.");
})

app.post("/signin", [
    check('email').isEmail(),
    check('password').isLength({min: 1})
],
  (req, res) => {signin.handleSignin(req, res, db, bcrypt)});

app.post("/register", [
    check('email').isEmail(),
    check('password').isLength({min: 1}),
    check('name').isLength({min: 1})
],
(req, res) => {register.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});
app.put('/image', (req, res) => {image.handleImageUpdate(req, res, db)});
app.post('/image', image.handleApiCall);

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`app is running on ${port}`);
})