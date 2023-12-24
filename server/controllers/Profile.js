const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async (req, res) => {
  try{
    //Fetch data
    const { firstName, lastName, dateOfBirth, about, contactNumber, gender } = req.body;
    //Fetch UserId
    const id=req.user.id;
    //Finding profile
    const userDetail = await User.findById(id);
    const profile = await Profile.findById(userDetail.additionalDetails);
    //Updating Profile
    if(firstName) userDetail.firstName=firstName;
    if(lastName) userDetail.lastName=lastName;
    if(dateOfBirth) profile.dateOfBirth=dateOfBirth;
    if(about) profile.about=about;
    if(contactNumber) profile.contactNumber=contactNumber;
    if(gender) profile.gender=gender;
    await profile.save();
    
    return res.status(200).json({
      success:true,
      message:"Profile Updated Successfully",
      profile, 
    });
  } catch(err){
    console.log("Error while updating profile");
    return res.status(500).json({
      success:false,
      message:"Server Error",
    });
  }
}

exports.deleteProfile = async (req, res) => {
  try{
    //Fetch UserId
    const id=req.user.id;

    //Validations
    if(!id){
      return res.status(400).json({
        success:false,
        message:"Please login to delete profile",
      });
    }
    const userDetails = await User.findById(id); 
    if(!userDetails){
      return res.status(400).json({
        success:false,
        message:"No user registered using this id",
      })
    }
    //Delete Profile
    await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

    //Unenroll user from all Courses to be done
    for (const courseId of userDetails.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnrolled: id } },
        { new: true }
      )
    }

    //Delete user
    await User.findByIdAndDelete({_id:id});

    //Returning response
    res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});

  } catch(err){
    console.log(err)
    return res.status(500).json({
      success:false,
      message:"Error while deleting profile",
    });
  }
}

exports.getAllUserDetails = async (req, res) => {
  try{
    //Fetch Id
    const id=req.user.id;

    //Validations and get user details
    const userDetails = await User.findById(id).populate("additionalDetails").exec();

    //returning response
    return res.status(200).json({
      success: true,
      message: "User Details fetched",
      data:userDetails,
    });
  } catch(err){
    console.log("Error while fetching all user details");
    return res.status(500).json({
      success:false,
      message:"Error while fetching all user details",
    });
  }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec()
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};