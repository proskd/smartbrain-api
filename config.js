const getDBConfig = (env) => {
    if (env === 'prod') {
        return {
            client: 'pg',
            connection: {
                host : '127.0.0.1',
                user : 'proskd',
                password : '',
                database : 'smart-brain'
            }
        }
    } else if (env === 'dev') {
        return {
            client: 'pg',
            connection: {
                host : '127.0.0.1',
                user : 'proskd',
                password : '',
                database : 'smart-brain'
            }
        }
    }
}

const getClarifaiKey = (env) => {
    if (env === 'prod') {
        return process.env.CLARIFAI_API_KEY;
    } else if (env === 'dev') {
        return '86b450683ca541aeb9a0d952716829ec';
    }
}


module.exports = {
    getDBConfig,
    getClarifaiKey
}