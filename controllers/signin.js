const { validationResult } = require('express-validator/check');

const handleSignin = (req, res, db, bcrypt) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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
}


module.exports = {
    handleSignin
}