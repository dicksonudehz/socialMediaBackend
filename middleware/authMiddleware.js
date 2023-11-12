import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import Admin from '../models/adminModel.js'

const protect = (async (req, res, next) => {
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
        token = req.headers.authorization.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        req.admin = await Admin.findById(decoded.id).select('-password')

        next()
        } catch (error) {
        console.error(error)
        res.status(401)
        throw new Error('Not authorized, token failed')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

const admin = (req, res, next) => {
    if (req.admin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as an admin')
    }
}

const user = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as an user')
    }
}

export { protect, admin, user}
