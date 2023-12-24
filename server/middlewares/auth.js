const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");

//auth
exports.auth = async (req, res, next) => {
  try{
    //Extracting token
    const token=req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

    //Checking presence of token
    if(!token){
      return res.status(401).json({
        success:false,
        message:"Token is missing!"
        });
    }

    //Verifing Token
    try{
      const decoded=jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user=decoded;
    } catch(err){
      return res.status(401).json({
        success:false,
        message:"Invalid Token ( Inside middleware auth ) !"
      });
    }
    next();
  } catch(err){
    return res.status(500).json({
      success:false,
      message: "Error while Authorization!"
    });
  }
}

//isStudent
exports.isStudent = async (req, res, next) => {
  try{
    if(req.user.accountType !== "Student"){
      return res.status(401).json({
        success:false,
        message:"You are not a student!"
      });
    }
    next();
  } catch(err){
    return res.status(500).json({
      success:false,
      message: "Error while Authorization of Students!"
    });
  }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
  try{
    if(req.user.accountType !== "Instructor"){
      return res.status(401).json({
        success:false,
        message:"You are not a Instructor!"
      });
    }
    next();
  } catch(err){
    return res.status(500).json({
      success:false,
      message: "Error while Authorization of Instructor!"
    });
  }
}

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try{
    const detail = req.user
    if(req.user.accountType !== "Admin"){
      return res.status(401).json({
        success:false,
        detail,
        message:"You are not a Admin!"
      });
    }
    next();
  } catch(err){
    return res.status(500).json({
      success:false,
      message: "Error while Authorization of Admin!"
    });
  }
}

