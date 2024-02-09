const express = require("express")
const router = express.Router()

const { capturePayment, verifySignature, purchaseDirectly, payment } = require("../controllers/Payments")
const { auth, isStudent } = require("../middlewares/auth")

router.post("/pay", auth, isStudent, payment)
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifySignature", auth , isStudent, verifySignature)
router.post("/purchaseDirectly", auth, isStudent, purchaseDirectly)

module.exports = router