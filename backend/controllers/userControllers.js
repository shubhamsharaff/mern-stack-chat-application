const User = require("../models/userModel")
const asyncHandler = require('express-async-handler')
const generateToken = require('../config/generateToken')

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    
    // Check For Empty Feilds
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Feilds")
    }

    // Check for user existance w.r.t email 
    const userExists = await User.findOne({ email })

    // if user exists 
    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    // creating a new user 
    const user = await User.create({
        name,
        email,
        password,
        pic
    })

    // if user creation successful 
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
    // if user creation fails 
    else {
        res.status(400);
        throw new Error("Failed to Create the User")
    }

})


const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log("email password ",req.body)
    // check user email exisits in DB or not 
    const user = await User.findOne({ email })

    // if exists 
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(401);
        throw new Error("Invalid Credentials")
    }
})

module.exports = {registerUser,authUser}