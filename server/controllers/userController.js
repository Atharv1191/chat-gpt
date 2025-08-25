
//API to register User

const User = require("../models/User");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');
const Chat = require("../models/Chat");
//generte jwt token
const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'})

}

const registerUser = async(req,res)=>{
    const {name,email,password} = req.body;
    try {
        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({
                success:false,
                message:"User alredy exists"
            })


        }
        const user = await User.create({name,email,password })
        const token = generateToken(user._id);
        return res.json({
            success:true,
            token
        })
    } catch (error) {
        
        return res.json({
            success:false,
            message:error.message
        })
        
    }

}
//API to login user
const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const  user = await User.findOne({email})
        if(user){
            const isMatch = await bcrypt.compare(password,user.password)
            if(isMatch){
                const token = generateToken(user._id);
                return res.json({
                    success:true,
                    token
                })
            }
        }
        return res.json({
            success:false,
            message:"Invalid email or  password"
        })
    } catch (error) {
         return res.json({
            success:false,
            message:error.message
        })
    }

}

//API to get userData

const getUser = async(req,res)=>{
    try {
        const user = req.user;
        return res.json({
            success:true,
            user
        })
        
    } catch (error) {
        console.log(error)
         return res.json({
            success:false,
            message:error.message
        })
    }
}
//API TO GET PUBLISHED IMAGES

const getPublishedImages = async(req,res)=>{
    try {
        const publishedImageMessages = await Chat.aggregate([
            {$unwind:"$messages"},
            {
                $match:{
                    "messages.isImage":true,
                    "messages.isPublished":true
                }
            },
            {
                $project:{
                    _id:0,
                    imageUrl:"$messages.content",
                    userName:"$userName"
                }
            }
        ])
        return res.json({
            success:true,
            images:publishedImageMessages.reverse()
        })
    } catch (error) {
        console.log(error)
         return res.json({
            success:false,
            message:error.message
        }) 
    }
}

module.exports = {registerUser,loginUser,getUser,getPublishedImages}