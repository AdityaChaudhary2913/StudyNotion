const Course=require('../models/Course');
const Category=require('../models/Category');
const User=require('../models/User');
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const { json } = require('body-parser');
const CourseProgress = require('../models/CourseProgress');
const { convertSecondsToDuration } = require('../utils/secToDuration');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
require("dotenv").config();

//create course
exports.createCourse = async (req, res) => {
  try{
    // Get user ID from request object
		const userId = req.user.id;
    
    //Fetch Data
    let {courseName, courseDescription, whatYouWillLearn, price, tag: _tag, category, status, instructions: _instructions} = req.body;
    
    //Get thumbnail
    const thumbnail=req.files.thumbnailImage;

    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions)

    //Validations
    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag.length || !category){
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

    const courseDe = await Course.findOne({courseName:courseName})
    if(courseDe){
      return res.status(400).json({
        success:false,
        message: "Course already exist"
      });
    }

    // Check given tag is valid or not
    // const categoryDetails = await Category.findOne({name:category})
    const categoryDetails = await Category.findById(category)
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
      courseName, courseDescription, instructor:instructorDetails._id, price, tag, category:categoryDetails._id, thumbnail:thumbnailImage.secure_url, status, instructions, whatYouWillLearn: whatYouWillLearn
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
        _id:category
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
    console.log(err)
    return res.status(500).json({
      success:false,
      message: "Failed to create course",
      err
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

    if(!courseId){
      return res.status(400).json({
        success:false,
        message: "Please provide course id"
      });
    }

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

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    //Returing response
    return res.status(200).json({
      success:true,
      message:"Course Details fetched successfully",
      data:{courseDetails, totalDuration},
    });
  } catch(err){
    return res.status(500).json({
      success:false,
      message: "Failed to get course details"
    });
  }
  
}

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()
      console.log(courseDetails)
    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 }).populate({path:"courseContent", populate:{path:"subSection"}}).exec();

    // TODO: Time duration of course should also be passed here

    // let totalDurationInSeconds = 0
    // instructorCourses.courseContent?.forEach((content) => {
    //   content.subSection?.forEach((subSection) => {
    //     const timeDurationInSeconds = parseInt(subSection.timeDuration)
    //     totalDurationInSeconds += timeDurationInSeconds
    //   })
    // })
  //   const totalDurationInSeconds = (instructorCourses.courseContent || [])
  // .flatMap(content => content.subSection || [])
  // .reduce((total, subSection) => total + parseInt(subSection?.timeDuration || 0), 0);
  // let totalDurationInSeconds = 0;

  // (instructorCourses.courseContent || []).forEach((content) => {
  //   (content.subSection || []).forEach((subSection) => {
  //     const timeDurationInSeconds = parseInt(subSection && subSection.timeDuration) || 0;
  //     totalDurationInSeconds += timeDurationInSeconds;
  //   });
  // });

  //   console.log(totalDurationInSeconds)

  //   const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)
    console.log("Updates->", updates)
    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
          // if(key === "tag"){

          // }
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}