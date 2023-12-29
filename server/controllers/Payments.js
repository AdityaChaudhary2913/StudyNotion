const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("../mail/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");
const crypto = require("crypto")

exports.capturePayment = async (req, res) => {
  const { courses } = req.body
  const userId = req.user.id
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await Course.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId)
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
      }

      // Add the price of the course to the total amount
      total_amount += course.price
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
exports.verifySignature = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      console.log("Updated course: ", enrolledCourse)

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}

exports.purchaseDirectly = async (req, res) => {
  const { courseId } = req.body
  const userId = req.user.id

  if (!courseId || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  try {
    // Find the course and enroll the student in it
    const enrolledCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $push: { studentsEnrolled: userId } },
      { new: true }
    )

    if (!enrolledCourse) {
      return res
        .status(500)
        .json({ success: false, error: "Course not found" })
    }
    console.log("Updated course: ", enrolledCourse)

    const courseProgress = await CourseProgress.create({
      courseID: courseId,
      userId: userId,
      completedVideos: [],
    })
    // Find the student and add the course to their list of enrolled courses
    const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: courseId,
          courseProgress: courseProgress._id,
        },
      },
      { new: true }
    )

    // Send an email notification to the enrolled student
    await mailSender(
      enrolledStudent.email,
      `Successfully Enrolled into ${enrolledCourse.courseName}`,
      courseEnrollmentEmail(
        enrolledCourse.courseName,
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
      )
    )
    return res.status(200).json({ success: true, message: "Student Enrolled" })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, error: error.message })
  }

}





//Capture the payment and initiate the razorpay order
// exports.capturePayment = async (req, res) => {
//   try{
//     //Fetch courseId and userId
//     const {course_id}=req.body;
//     const userId=req.user.id;

//     //Validations
//     if(!userId){
//       return res.status(400).json({
//         success:false,
//         message:"Please login first!"
//       })
//     }
//     if(!course_id){
//       return res.status(400).json({
//         success:false,
//         message:"Course id is required"
//       });
//     }

//     //Course validation
//     let course;
//     try{
//       course=await Course.findById(course_id);
//       if(!course){
//         return res.status(400).json({
//           success:false,
//           message:"Course not found"
//         });
//       }
//       //Check if user have already paid the course or not
//       const uid=new mongoose.Types.ObjectId(userId);
//       if(course.studentsEnrolled.includes(uid)){
//         return res.status(400).json({
//           success:false,
//           message:"You have already paid the course" 
//         });
//       }
//     } catch(err){
//       return res.status(400).json({
//         success:false,
//         message:"Course not found"
//       });
//     }

//     //order created
//     const amount = course.price;
//     const currency = "INR";
//     const options = {
//       amount:amount*100,
//       currency,
//       receipt: Math.random(Date.now()).toString(),
//       notes:{
//         courseId: course_id,
//         userId,
//       }
//     }
//     try{
//       //Initiate the payment using razorpay
//       const paymentResponse = await instance.orders.create(options);
//       console.log(paymentResponse);
//       //returning response
//       res.status(200).json({
//         success:true,
//         courseName:course.courseName,
//         courseDescription:course.courseDescription,
//         thumbnail: course.thumbnail,
//         orderId: paymentResponse.id,
//         currency:paymentResponse.currency,
//         amount:paymentResponse.amount,
//       });
//     } catch(err){
//       return res.status(400).json({
//         success:false,
//         message:"Error while initiating payment"
//       });
//     }

//     //returning response
//     return res.status(200).json({
//       success:true,
//       message:"Payment initiated"
//     });
//   } catch(err){
//     console.log(err);
//     res.status(500).json({
//       status:false,
//       message: "Error while capturing payment",
//     });
//   }
// };

// //Verify signature  of razorpay and server
// exports.verifySignature = async (req, res) => {
//   //Secret Matching
//   const webHookSecret = "12345678";
//   const signature = req.headers("x-razorpay-signature");
//   const shasum = crypto.createHmac("sha256", webHookSecret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");
//   if(signature == digest){
//     console.log("Payment is authorised!");
//     const {courseId, userId} = req.body.payload.payment.entity.notes;
//     try{
//       //finding the course and enrolling the student in the course
//       const enrolledCourse = await Course.findOneAndUpdate({_id:courseId}, {$push:{studentsEnrolled:userId}}, {new:true});
//       if(!enrolledCourse) {
//         return res.status(500).json({
//             success:false,
//             message:'Course not Found',
//         });
//       }
//       console.log(enrolledCourse);
      
//       //Finding the student and adding the course to his enrolled courses
//       const enrolledStudent = await User.findOneAndUpdate({_id:userId}, {$push:{courses:courseId}}, {new:true});
//       console.log(enrolledStudent);

//       //Sending confirmation mail
//       const emailResponse = await mailSender(enrolledStudent.email, "Congratulations from StudyNotion", "Congratulations, you are onboarded into new StudyNotion Course");
//       console.log(emailResponse);

//       //Returning response
//       return res.status(200).json({
//         success:true,
//         message:"Signature Verified and COurse Added",
//       });
//     } catch(error){
//         console.log("Error while enrolling into course!");
//         return res.status(500).json({
//           success:false,
//           message:error.message,
//         });
//     }
//   }
//   else{
//     return res.status(400).json({
//       success:false,
//       message:'Invalid request, secret key not matching!',
//     });
//   }

// }