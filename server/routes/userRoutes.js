
const express = require("express");
const protect = require("../middelewers/auth");
const { registerUser, loginUser, getUser, getPublishedImages } = require("../controllers/userController");

const router = express.Router()


router.post("/register",registerUser);
router.post('/login',loginUser);
router.get('/data',protect,getUser)
router.get('/published-images',getPublishedImages)

module.exports = router