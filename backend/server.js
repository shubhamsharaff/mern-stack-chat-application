const express = require("express");
const dotenv = require("dotenv")
const { chats } = require("./data/data")
const connectDB = require("./config/db")
const colors = require('colors')
const userRoutes = require('./routes/userRoutes')
const {errorHandler,notFound} = require('./middleware/errorMiddleware')


const app = express();
dotenv.config();

// DB Connection 
connectDB();

// To Accept json data
app.use(express.json())

// API Endpoints
app.use('/api/user',userRoutes)

// Errors handling Middlewares 
app.use(notFound)
app.use(errorHandler)


app.get('/', (req, res) => {
    res.send("API is running")
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server Started on PORT : ${PORT}`.yellow.bold))