

//API controoler for creating new chat

const Chat = require("../models/Chat");

const createChat = async (req, res) => {
    try {
        const userId = req.user._id;

        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name
        }
        await Chat.create(chatData)
        return res.json({
            success: true,
            message: "Chat created"
        })

    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })

    }

}
//function to getting all chats


const getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 })
        return res.json({
            success: true,
            chats
        })


    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })

    }

}

//delete chats

const deleteChats = async (req, res) => {
    try {
        const userId = req.user._id;
       const {chatId} = req.body;
       await Chat.deleteOne({_id:chatId,userId})
        return res.json({
            success: true,
            message:"Chat deleted"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })

    }

}

module.exports = { createChat, getChats,deleteChats }