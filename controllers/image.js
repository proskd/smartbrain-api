const handleImageUpdate = (req, res, db) => {
    const {id} = req.body;

    db('users').where({id: id}).increment('entries', 1).returning('entries')
        .then(entries => {
            res.json(entries);            
        }).catch(error => res.status(400).json("error updating user"));
};

module.exports = {
    handleImageUpdate
}