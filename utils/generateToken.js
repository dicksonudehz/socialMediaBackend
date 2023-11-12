import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign( {id} , process.env.JWT_SECRET, {
        expiresIn: '1500s'
    })
}

export default generateToken