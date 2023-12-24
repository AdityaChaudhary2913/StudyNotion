const User=require('../models/User');
const OTP=require('../models/OTP');
const otpGenerator=require('otp-generator');
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const mailSender=require("../utils/mailSender");
const { updatedPassword } = require('../mail/updatedPassword');
const Profile = require("../models/Profile");
require("dotenv").config();

//signUp
exports.signUp = async (req, res) => {
  try{
    //Fetch data from request body
    const {firstName, lastName, email ,password, confirmPassword, accountType, contactNumber, otp} = req.body;

    //Validating
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
      return res.status(400).json({
        message: 'Please provide all the required fields',
        success:false
      });
    }

    //Password matching
    if(password !== confirmPassword){
      return res.status(400).json({
        message: 'Password do not match , please try again',
        success:false
      });
    }

    //Check user exist or not
    const existUser = await User.findOne({email:email});
    if(existUser){
      return res.status(400).json({
        message: 'User already registered!',
        success:false
      })
    }

    //Find most recent OTP
    const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
    
    //Validate OTP
    if(recentOtp.length === 0){
      return res.status(400).json({
        message: 'Please try again, OTP not came',
        success:false
      });
    } 
    else if(otp !== recentOtp[0].otp){
      return res.status(400).json({
        message: 'OTP expired',
        success:false
      });
    }
    
    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    //Create entry in DB
    const profileDetails = await Profile.create({
      gender:null,
      dateOfBirth:null,
      about:null,
      contactNumber:null
    }); 
    
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      accountType: accountType,
      password:hashedPassword,
      approved: true,
      additionalDetails:profileDetails._id,
      image:`https://api.dicebear.com/7.x/pixel-art/svg?seed=${firstName} ${lastName}`
    });

    //Returning response
    return res.status(200).json({
      success:true,
      user,
      message:"User registered successfully"
    })
  }
  catch(e){
    console.log(e);
    return res.status(400).json({
      message: 'Something went wrong while signing up',
      success:false
    });
  }
}

//Login
exports.login = async (req, res) => {
  try{
     //Fetch data from request body
      const {email, password} = req.body;

      //Validate data
      if(!email || !password){
        return res.status(400).json({
          message: 'Please provide email and password',
          success:false
        });
      }

      //Validate existence of Email id
      const user = await User.findOne({email}).populate("additionalDetails");
      if(!user){
        return res.status(400).json({
          message: 'User not found',
          success:false
        });
      }

      //Compare Password
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        return res.status(403).json({
          success:false,
          message:"Please enter correct password"
        })
      }

      //Create a playload
      const playload={
        email:user.email,
        id:user._id,
        accountType:user.accountType
      }

      //Generate JWT token
      const token=jwt.sign(playload, process.env.JWT_SECRET, {expiresIn:"2h"});
      user.token=token;
      user.password=undefined;  //Removing from object not from database

      //Creating cookie and sending response
      const options={
        expires: new Date(Date.now() + (3*24*60*60*1000)),
        httpOnly:true
      }
      res.cookie("token", token, options).status(200).json({
        success:true,
        token, user,
        message:"User logged in successfully"
      })
  }
  catch(e){
    console.log(e);
    return res.status(500).json({
      success:false,
      message:"Error while Logging in!"
    })
  }
}

//sendOTP
exports.sendotp = async (req, res) => {
  try{
    //Fetching email from request body
    const {email} = req.body;

    //Check if user already exist or not
    const checkUserPresent = await User.findOne({email});
    if(checkUserPresent){
      return res.status(401).json({
        message: 'User already exist',
        success:false
        });
    }

    //Generating OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets:false,
      lowerCaseAlphabets:false,
      specialChars:false,
    });
    console.log("OTP generated ", otp);

    //Check if OTP is unique or not
    let result=await OTP.findOne({otp:otp});
    while(result){
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
      });
      result=await OTP.findOne({otp:otp});
    }
    
    //Entry of OTP into DataBase
    const otpPayload={email, otp};
    const otpBody=await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      message: 'OTP sent Successfully!',
      success:true,
      otp
    })

  } catch(err){
    res.status(500).json({
      success:false,
      message: "Error while sending OTP in sendotp controller",
    });
  }
}

//changePassword
exports.changePassword = async (req, res) => {
  try{
    //Fetch data from request body
    const userDetails = await User.findById(req.user.id);

    //get oldPassword, newPassword, confirmPassword
    const {oldPassword, newPassword, confirmNewPassword} = req.body;

    //Validations (pw matching, emptyness)
    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if(!isPasswordMatch){
      return res.status(401).json({
        success:false,
        message:"The password is incorrect!"
      })
    };

    //Matching new password
    if(newPassword !== confirmNewPassword){
      return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
    }
    
    //Updating Password in Database
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(req.user.id, {password:encryptedPassword}, {new:true});

    //Send mail for updated password
    try{
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        updatedPassword(updatedUserDetails.email, `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`),
        console.log("Email sent successfully"),
      );
    } catch(err){
      console.log(err);
      console.log("Error while sending updated password email")
      return res.status(500).json({
        success:false,
        message:"Error while sending updated password email!"
      })
    }

    //returning response
    return res.status(200).json({ 
      success: true, 
      message: "Password updated successfully"
    });

  } catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Error while changing password!",
    });
  }
}