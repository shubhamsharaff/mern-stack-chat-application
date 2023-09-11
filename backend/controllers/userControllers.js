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
    console.log("email password ", req.body)
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

// url : /api/user?search=piyush
const allUsers = asyncHandler(async (req, res) => {
    console.log("tsets")
    /* It checks if there is a query parameter named "search" in the request (req.query.search). 
    This parameter is typically used to filter the list of users based on a search keyword.

    If the "search" query parameter is present, the code constructs a MongoDB query object 
    (keyword) that uses the $or operator to perform a case-insensitive search on both the 
    "name" and "email" fields of the user documents in the database.
    */
    const keyword = req.query.search
        ? {
            $or: [
                 // Use the $regex operator to perform a case-insensitive search on the "name" field.
                { name: { $regex: req.query.search, $options: "i" } },
                // Use the $regex operator to perform a case-insensitive search on the "email" field.
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
    // It adds a condition to exclude the user who made the request. Here, it uses the $ne (not equal) 
    // operator to ensure that the _id of the retrieved users is not equal to the _id of the current user (req.user._id).
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});


module.exports = { registerUser, authUser, allUsers }