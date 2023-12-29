const Section=require("../models/Section");
const Course=require("../models/Course");
const SubSection = require("../models/SubSection");

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
    const {sectionName, sectionId, courseId} = req.body;

    //Data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        error: "Please provide section name and course id"
      });
    }

    //Update data
    const section=await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    //Returning response
    return res.status(200).json({
      success: true,
      message: section,
      data: course
    });

  } catch(err){
    return res.status(500).json({
      success:false,
      message:"Error while updating section",
    });
  }
}

exports.deleteSection = async (req, res) => {
  try{
    //Getting ID
    const {sectionId, courseId}=req.body;
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    })

    const section = await Section.findById(sectionId)
    console.log(sectionId, courseId)
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      })
    }

    //Deleting ID
    await SubSection.deleteMany({ _id: { $in: section.subSection } })
    await Section.findByIdAndDelete(sectionId);

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    //Returning response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: course
    });

  } catch(err){
    return res.status(500).json({
      success:false,
      message:"Error while deleting section",
    });
  }
}