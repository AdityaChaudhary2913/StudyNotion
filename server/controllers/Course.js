const Course=require('../models/Course');
const Category=require('../models/Category');
const User=require('../models/User');
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();

//create course
exports.createCourse = async (req, res) => {
  try{
    // Get user ID from request object
		const userId = req.user.id;

    //Fetch Data
    let {courseName, courseDescription, whatYouWillLearn, price, tag, category, status, instructions} = req.body;

    //Get thumbnail
    const thumbnail=req.files.thumbnailImage;

    //Validations
    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !category){
      return res.status(400).json({
        error: "Please fill all the fields"
      });
    }
    if (!status || status === undefined) {
			status = "Draft";
		}
    
    //Check for instructor
    const instructorDetails = await User.findById(userId, {accountType:"Instructor"});
    if(!instructorDetails){
      return res.status(404).json({
        success:false,
        message: "Instructor details not found"
      });
    }
    
    //Check given tag is valid or not
    const categoryDetails=await Category.findById(category);
    if(!categoryDetails){
      return res.status(404).json({
        success:false,
        message: "Category details not found"
      });
    }
    
    //Upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
    
    //Create and entry for new course
    const newCourse= await Course.create({
      courseName, courseDescription, instructor:instructorDetails._id, price, tag:categoryDetails._id, thumbnail:thumbnailImage.secure_url, status: status,
			instructions: instructions,
    })

    //Add the new course to course schema of instructor
    await User.findByIdAndUpdate(
      {
        _id:instructorDetails._id
      },
      {
        $push: {courses:newCourse._id,}
      },
      {
        new:true
      }
    );

    //Update the tag schema
    await Category.findByIdAndUpdate(
      {
        _id:categoryDetails._id
      },
      {
        $push: {courses:newCourse._id,}
      },
      {
        new:true
      }
    );

    //return response
    return res.status(200).json({
      success:true,
      message: "Course created successfully",
      date:newCourse,
    });
  } catch(err){
    return res.status(500).json({
      success:false,
      message: "Failed to create course"
      });
  }
}

//get all course
exports.showAllCourses = async (req,res) => {
  try{
    const allCourses=await Course.find({}, {courseName:true, price:true, thumbnail:true, instructor:true}).populate("instructor").exec();
    return res.status(200).json({
      success:true,
      message: "All courses fetched",
      data:allCourses
    });
    } catch(err){
        return res.status(500).json({
          success:false,
          message: "Failed to get courses"
        });
  }
}

//get all course details
exports.getCourseDetails = async (req, res) => {
  try{
    //Fetch id
    const {courseId}=req.body;

    //Find course details
    const courseDetails = await Course.findById({_id:courseId})
                                      .populate({path:"instructor", populate:{path:"additionalDetails"}})
                                      .populate("category")
                                      .populate({path:"courseContent", populate:{path:"subSection"}})
                                      .exec();

    //Validations
    if(!courseDetails){
      return res.status(404).json({
        success:false,
        message: "No course found"
      });
    }

    //Returing response
    return res.status(200).json({
      success:true,
      message:"Course Details fetched successfully",
      data:courseDetails,
    });
  } catch(err){
    return res.status(500).json({
      success:false,
      message: "Failed to get course details"
    });
  }
  
}