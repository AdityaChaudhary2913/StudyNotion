const express = require("express")
const router = express.Router()

const { capturePayment, verifySignature, purchaseDirectly } = require("../controllers/Payments")
const { auth, isStudent } = require("../middlewares/auth")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifySignature", auth , isStudent, verifySignature)
router.post("/purchaseDirectly", auth, isStudent, purchaseDirectly)

module.exports = router