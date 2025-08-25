
const express = require("express");
const protect = require("../middelewers/auth");
const { textMessageController, imageMessageController } = require("../controllers/MessageController");

const router = express.Router()

router.post('/text',protect,textMessageController);
router.post('/image',protect,imageMessageController)

module.exports = router