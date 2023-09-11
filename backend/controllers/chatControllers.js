const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')
// This end point will responsible for creation or fetch
// one-on-one chat
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    // if userId not exists 
    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400)
    }
    /* This query aims to find non-group chat documents where both the current user and the specified user are participants. The result (isChat) will be a list of chat documents that meet these criteria. 
    */
    let isChat = await Chat.find({
        // Filter for non-group chats
        isGroupChat: false,
        // 
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
        // Populate give the info of the 'users' field while excluding the 'password' field
    }).populate("users", "-password")
        .populate("latestMessage")
    /*
    isChat array (which contains Chat documents) and 
    populates the latestMessage.sender field with 
    additional data from the User collection. 
    Specifically, it fetches the name, pic, and email fields of the sender referenced in the latestMessage field of each Chat document.
    */
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    })

    // Condition if chat exists
    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    // Condition if chat doesn't exists 
    else {
        // create a new chat 
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };
        try {
            const createdChat = await Chat.create(chatData);

            // Condition to search chat w.r.t just now createdChat id
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");

            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400);
            throw new Error(error.message)
        }
    }
})
const fetchChats = asyncHandler(async (req, res) => {
    try {
        /*
        This query is looking for Chat documents where the "users" array contains at least one element 
        that is equal to the ID of the current user (req.user._id).It's used to find chats that involve the current user as a participant.
        
        $elemMatch: This is an operator used to query elements within an array.
        */
        Chat.find({
            users:
                { $elemMatch: { $eq: req.user._id } }
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(results)
            })
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})

const createGroupChat = asyncHandler(async (req, res) => {

    // Condition check for empty feilds 
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" })
    }
    // JSON.parse() converts the JSON string into a JavaScript object
    // named users
    const users = JSON.parse(req.body.users)

    // condition check to create a group at least it has 2 users
    // or more than 2 users
    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat")
    }
    // Add the current user (req.user) to the list of group chat participants
    // By pushing req.user into the users array, you are essentially 
    // adding the current user to the group chat's list of participants. 
    users.push(req.user);

    try {
        // creating group chat with following info
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        // search and fetch group chat and send it to client
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    // destructuring request body 
    const { chatId, chatName } = req.body;

    // using db query to find group chat by id
    // and update the name of the particular chat
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    // If id is not available in collection  
    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        // Response 
        res.json(updatedChat);
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    const {chatId,userId} = req.body;

    const addedToGroup = await Chat.findByIdAndUpdate(
        chatId,{
            $push :{users:userId}
        },
        {new : true}
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
    
    if (!addedToGroup) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        // Response 
        res.json(addedToGroup);
    }
})
const removeFromGroup = asyncHandler(async (req, res) => {
    const {chatId,userId} = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,{
            $pull :{users:userId}
        },
        {new : true}
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
    
    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        // Response 
        res.json(removed);
    }
})
module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
}