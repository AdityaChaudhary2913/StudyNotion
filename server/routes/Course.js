const express = require("express")
const router = express.Router()
const {
  createCourse,
  showAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  deleteCourse,
  getInstructorCourses,
  editCourse,
} = require("../controllers/Course")
const {
  showAllCategory,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category")
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection")
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
const { updateCourseProgress } = require("../controllers/courseProgress")
const { addToCart, removeFromCart } = require("../controllers/Cart")

router.post("/createCourse", auth, isInstructor, createCourse)
router.post("/addSection", auth, isInstructor, createSection)
router.post("/editCourse", auth, isInstructor, editCourse)
router.post("/updateSection", auth, isInstructor, updateSection)
router.post("/deleteSection", auth, isInstructor, deleteSection)
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
router.post("/addSubSection", auth, isInstructor, createSubSection)
router.get("/getAllCourses", showAllCourses)
router.post("/getCourseDetails", getCourseDetails)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
router.delete("/deleteCourse", auth, isInstructor, deleteCourse)
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)

router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategory)
router.post("/getCategoryPageDetails", categoryPageDetails)

router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

router.post("/addToCart", auth, isStudent, addToCart)
router.post("/removeFromCart", auth, isStudent, removeFromCart)

module.exports = router