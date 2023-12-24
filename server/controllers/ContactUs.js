const { contactForm }  = require("../mail/contactForm");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

exports.ContactUs = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, message, CountryCode } = req.body;
  try{
    const emailResponse = await mailSender(email, "Your Data send successfully", contactForm(email, firstName, lastName, message, phoneNumber, CountryCode));
    const messSend = await mailSender(process.env.MAIL_RECIEVER, "You have recieved a new mail", message);
    return res.json({
      success: true,
      message: "Email send successfully",
    })
  } catch(err){
    console.log("Error in Contact Us", err);
    return res
    .status(500)
    .json({ success:true, message: "Error in contact us controller" });
  }
}