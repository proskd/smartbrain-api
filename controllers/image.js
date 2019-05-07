const Clarifai = require('clarifai');

const clarifaiApp = new Clarifai.App({
    apiKey: "86b450683ca541aeb9a0d952716829ec"
});

const handleApiCall = (req, res) => {

    let {url} = req.body;

    clarifaiApp.models.predict(Clarifai.FACE_DETECT_MODEL, 
        url
        )
        .then((response) => {
            return res.json(response);
        })
        .catch((error) => {
            console.log(error)
            res.status(400).json('bad request');
        });
};

const handleImageUpdate = (req, res, db) => {
    const {id} = req.body;

    db('users').where({id: id}).increment('entries', 1).returning('entries')
        .then(entries => {
            res.json(entries);            
        }).catch(error => res.status(400).json("error updating user"));
};

module.exports = {
    handleImageUpdate,
    handleApiCall
}