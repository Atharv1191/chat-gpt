const express = require("express")
const { getPlans, purchasePlan } = require("../controllers/creditController")
const protect = require("../middelewers/auth")

const router = express.Router()

router.get('/plan',getPlans)
router.post('/purchase',protect,purchasePlan)

module.exports = router;