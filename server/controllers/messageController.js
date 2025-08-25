// // Text baseed AI Chat Message Controller

// const axios = require("axios");

// const Chat = require("../models/Chat");
// const User = require("../models/User");
// const imagekit = require("../configs/imagekit");

// const textMessageController = async (req, res) => {
//     try {
//         const userId = req.user._id;

//         if (req.user.credits < 1) {
//             return res.json({
//                 success: false,
//                 message: "You don't have enough credits to use this feature"
//             });
//         }
//         const { chatId, prompt } = req.body;

//         const chat = await Chat.findOne({ userId, _id: chatId });
//         chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false });

//         const { choices } = await openai.chat.completions.create({
//             model: "gemini-2.0-flash",
//             messages: [
               
//                 {
//                     role: "user",
//                     content: prompt,
//                 },
//             ],
//         });

//         const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false };

//         chat.messages.push(reply);
//         await chat.save();
//         await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

//         return res.json({
//             success: true,
//             reply,
//         });

//     } catch (error) {
//         console.log(error);
//         return res.json({
//             success: false,
//             message: error.message,
//         });
//     }
// };


// //Image generation Message controller

// const imageMessageController = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         // check credits 
//         if (req.user.credits < 2) {
//             return res.json({
//                 success: false,
//                 message: "You don't have enough credits to use this feature"
//             });
//         }

//         const { prompt, chatId, isPublished } = req.body; // ✅ fixed typo

//         // find chat
//         const chat = await Chat.findOne({ userId, _id: chatId });
//         chat.messages.push({
//             role: "user",
//             content: prompt,
//             timestamp: Date.now(),
//             isImage: false
//         });

//         // encode the prompt
//         const encodedPrompt = encodeURIComponent(prompt);

//         // construct imagekit AI generation URL
//         const generateImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w=800,h=800`;

//         // trigger generation by fetching from imagekit
//         const aiImageResponse = await axios.get(generateImageUrl, { responseType: "arraybuffer" });

//         // convert to base64
//         const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;

//         // upload to imagekit media library
//         const uploadResponse = await imagekit.upload({
//             file: base64Image,
//             fileName: `${Date.now()}.png`,
//             folder: "quickgpt"
//         });

//         const reply = {
//             role: "assistant",
//             content: uploadResponse.url,
//             timestamp: Date.now(),
//             isImage: true,
//             isPublished
//         };

//         // ✅ push reply & save before sending response
//         chat.messages.push(reply);
//         await chat.save();
//         await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

//         return res.json({
//             success: true,
//             reply
//         });

//     } catch (error) {
//         console.log(error);
//         return res.json({
//             success: false,
//             message: error.message,
//         });
//     }
// };


// module.exports = { textMessageController,imageMessageController };
// Text based AI Chat Message Controller

const axios = require("axios");

const Chat = require("../models/Chat");
const User = require("../models/User");
const imagekit = require("../configs/imagekit");
const openai = require('../configs/openai')

const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;

        if (req.user.credits < 1) {
            return res.json({
                success: false,
                message: "You don't have enough credits to use this feature"
            });
        }
        const { chatId, prompt } = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId });
        
        // Check if chat exists
        if (!chat) {
            return res.json({
                success: false,
                message: "Chat not found"
            });
        }

        chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false });

        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
               
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false };

        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

        return res.json({
            success: true,
            reply,
        });

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};


//Image generation Message controller

const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        // check credits 
        if (req.user.credits < 2) {
            return res.json({
                success: false,
                message: "You don't have enough credits to use this feature"
            });
        }

        const { prompt, chatId, isPublished } = req.body;

        // find chat
        const chat = await Chat.findOne({ userId, _id: chatId });
        
        // Check if chat exists
        if (!chat) {
            return res.json({
                success: false,
                message: "Chat not found"
            });
        }

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

        // encode the prompt
        const encodedPrompt = encodeURIComponent(prompt);

        // construct imagekit AI generation URL
        const generateImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

        // trigger generation by fetching from imagekit
        const aiImageResponse = await axios.get(generateImageUrl, { responseType: "arraybuffer" });

        // convert to base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString("base64")}`;

        // upload to imagekit media library
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "quickgpt"
        });

        const reply = {
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        };

        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

        return res.json({
            success: true,
            reply
        });

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { textMessageController, imageMessageController };