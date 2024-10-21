const jwt = require('jsonwebtoken')

const generateJWT = (uuid, name) => {
    return new Promise((resolve, reject) => {
        const payload = {uuid, name}

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err, token) => {
            if(err){
                console.log(err)
                reject('The token coulnt be generated')
            }
            resolve(token)
        })
    })
}

module.exports = {generateJWT}