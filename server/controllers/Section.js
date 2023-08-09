const Section=require("../models/Section");
const Course=require("../models/Course");

exports.createSection = async (req, res) => {
  try{
    //Data fetch
    const {sectionName, courseId} =req.body;

    //Data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        error: "Please provide section name and course id"
      });
    }

    //Create section
    const newSection=await Section.create({sectionName});

    //Updating course with section objectId
    const updatedCourseDetails=await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id
        }
      },
      {
        new:true,
      }
    ).populate({ path: "courseContent", populate: {path: "subSection"} }).exec();

    //Returning response
    return res.status(201).json({
      success:true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch(err){
    return res.status(500).json({
      success:false,
      message:"Error while creating section",
    })
  }
}

exports.updateSection = async (req, res) => {
  try{
    //Data input
    const {sectionName, sectionId} = req.body;

    //Data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        error: "Please provide section name and course id"
      });
    }

    //Update data
    const section=await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

    //Returning response
    return res.status(200).json({
      message: "Section updated successfully",
      data: section
    });

  } catch(err){
    return res.status(500).json({
      success:true,
      message:"Error while updating section",
    });
  }
}

exports.deleteSection = async (req, res) => {
  try{
    //Getting ID
    const {sectionId}=req.body;

    //Deleting ID
    const section = await Section.findByIdAndDelete(sectionId);

    //Updating Course

    //Returning response
    return res.status(200).json({
      message: "Section deleted successfully",
      data: section
    });

  } catch(err){
    return res.status(500).json({
      success:true,
      message:"Error while deleting section",
    });
  }
}