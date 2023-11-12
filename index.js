import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import auth from './routes/authsRoute.js'
import user from './routes/userRoute.js'
import post from './routes/postRoute.js'
// import productRoute from './Routes/product.js'
// import orderRoute from './Routes/order.js'
// import issueRoute from './Routes/issue.js'


dotenv.config()

connectDB().then()

const app = express()

app.use(express.json())
app.use(cors())

app.use(express.urlencoded({ extended: false }));

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.get('/', (req,res)=>{
  res.send('Backend Server running successfully')
})

app.use('/api/authsRoute', auth)
app.use('/api/userRoute', user)
app.use('/api/postRoute', post)
// app.use('/api/projectY/admin', adminRoute)
// app.use('/api/products', productRoute)
// app.use('/api/orders', orderRoute)
// app.use('/api/issues', issueRoute)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8080

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
)