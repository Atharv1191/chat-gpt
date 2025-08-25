
const express = require("express");
const protect = require("../middelewers/auth");
const { createChat, getChats, deleteChats } = require("../controllers/chatController");


const router = express.Router();

router.get('/create',protect,createChat);
router.get('/get',protect,getChats);
router.post('/delete',protect,deleteChats)

module.exports = router;