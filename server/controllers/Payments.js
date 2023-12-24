const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

//Capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
  try{
    //Fetch courseId and userId
    const {course_id}=req.body;
    const userId=req.user.id;

    //Validations
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"Please login first!"
      })
    }
    if(!course_id){
      return res.status(400).json({
        success:false,
        message:"Course id is required"
      });
    }

    //Course validation
    let course;
    try{
      course=await Course.findById(course_id);
      if(!course){
        return res.status(400).json({
          success:false,
          message:"Course not found"
        });
      }
      //Check if user have already paid the course or not
      const uid=new mongoose.Types.ObjectId(userId);
      if(course.studentsEnrolled.includes(uid)){
        return res.status(400).json({
          success:false,
          message:"You have already paid the course" 
        });
      }
    } catch(err){
      return res.status(400).json({
        success:false,
        message:"Course not found"
      });
    }

    //order created
    const amount = course.price;
    const currency = "INR";
    const options = {
      amount:amount*100,
      currency,
      receipt: Math.random(Date.now()).toString(),
      notes:{
        courseId: course_id,
        userId,
      }
    }
    try{
      //Initiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);
      //returning response
      res.status(200).json({
        success:true,
        courseName:course.courseName,
        courseDescription:course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency:paymentResponse.currency,
        amount:paymentResponse.amount,
      });
    } catch(err){
      return res.status(400).json({
        success:false,
        message:"Error while initiating payment"
      });
    }

    //returning response
    return res.status(200).json({
      success:true,
      message:"Payment initiated"
    });
  } catch(err){
    console.log(err);
    res.status(500).json({
      status:false,
      message: "Error while capturing payment",
    });
  }
};

//Verify signature  of razorpay and server
exports.verifySignature = async (req, res) => {
  //Secret Matching
  const webHookSecret = "12345678";
  const signature = req.headers("x-razorpay-signature");
  const shasum = crypto.createHmac("sha256", webHookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  if(signature == digest){
    console.log("Payment is authorised!");
    const {courseId, userId} = req.body.payload.payment.entity.notes;
    try{
      //finding the course and enrolling the student in the course
      const enrolledCourse = await Course.findOneAndUpdate({_id:courseId}, {$push:{studentsEnrolled:userId}}, {new:true});
      if(!enrolledCourse) {
        return res.status(500).json({
            success:false,
            message:'Course not Found',
        });
      }
      console.log(enrolledCourse);
      
      //Finding the student and adding the course to his enrolled courses
      const enrolledStudent = await User.findOneAndUpdate({_id:userId}, {$push:{courses:courseId}}, {new:true});
      console.log(enrolledStudent);

      //Sending confirmation mail
      const emailResponse = await mailSender(enrolledStudent.email, "Congratulations from StudyNotion", "Congratulations, you are onboarded into new StudyNotion Course");
      console.log(emailResponse);

      //Returning response
      return res.status(200).json({
        success:true,
        message:"Signature Verified and COurse Added",
      });
    } catch(error){
        console.log("Error while enrolling into course!");
        return res.status(500).json({
          success:false,
          message:error.message,
        });
    }
  }
  else{
    return res.status(400).json({
      success:false,
      message:'Invalid request, secret key not matching!',
    });
  }

}