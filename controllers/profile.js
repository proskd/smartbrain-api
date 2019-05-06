const handleProfileGet = (req, res, db) => {
    const {id} = req.params;

    db.select('*').from('users').where({id: id}).then(user => {
        found = true;
        res.json(user[0]);
    }).catch(error => res.status(400).json("not found"));
};


module.exports = {
    handleProfileGet
}