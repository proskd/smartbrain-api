const express = require('express');
const bodyparse = require('body-parser');

const app = express();

app.use(bodyparse.json());

const database = {
    users: [
        {
            id: '123',
            name: 'Dave',
            email: 'proskd@gmail.com',
            password: 'dave',
            entries: 0,
            joined: new Date()
        },
        {
            id: '125',
            name: 'Cindy',
            email: 'cnezames@gmail.com',
            password: 'cindy',
            entries: 0,
            joined: new Date()
        }
    ]
};

app.get("/", (req, res) => {
    res.json(database.users);
})

app.post("/signin", (req, res) => {

    const {email, password} = req.body;
    let foundUser;

    let found = database.users.some((user) => {
        if (user.email === email && user.password === password) {
            foundUser = user;
            return true;
        }
        return false;
    })

    if (found) {
        let {id, name, email} = foundUser;
        let resUser = {
            id: id,
            name: name, 
            email: email
        }
        res.json(resUser);
    } else {
        res.status(400).json("User not found");;
    }
});

app.post("/register", (req, res) => {
    const {email, password, name} = req.body;

    let newUser = {
        email: email,
        password: password,
        name: name,
        id: "5001",
        entries: 0,
        joined: new Date()
    }

    database.users.push(newUser);

    let resUser = {
        id: newUser.id,
        name: name, 
        email: email
    }

    res.json(newUser);
});

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;

    database.users.forEach((user) => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });

    if (!found) {
        res.status(400).json("no such user");
    }
});

app.put('/image', (req, res) => {
    const {id} = req.body;
    let found = false;

    database.users.forEach((user) => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });

    if (!found) {
        res.status(400).json("no such user");
    }
});

app.listen(3001, () => {
    console.log("app is running");
})