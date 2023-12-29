import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
// import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { fetchCourseDetails } from "../services/operation/courseDetailAPI"
import GetAvgRating from "../utils/avgRating"
import Error from "./Error"
import { BuyCourse, purchaseDirectly } from "../services/operation/studentFeaturesAPI"
import ConfirmationModel from "../components/common/ConfirmationModel"
import { formatDate } from "../services/formatDate"
import RatingStars from "../components/common/RatingStars"

const CourseDetails = () => {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Course Details")
      }
    })()
  }, [courseId])
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(response?.data?.courseDetails?.ratingAndReviews)
    setAvgReviewCount(count)
  }, [response])
  const [isActive, setIsActive] = useState(Array(0))
  const handleActive = (id) => {
    // console.log("called", id)
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    )
  }

  // Total number of lectures
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  useEffect(() => {
    let lectures = 0
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!response.success) {
    return <Error />
  }

  // const {
  //   _id: course_id,
  //   courseName,
  //   courseDescription,
  //   thumbnail,
  //   price,
  //   whatYouWillLearn,
  //   courseContent,
  //   ratingAndReviews,
  //   instructor,
  //   studentsEnroled,
  //   createdAt,
  // } = response.data?.courseDetails

  const handleBuyCourse = async () => {
    if (token) {
      // await BuyCourse(token, [courseId], user, navigate, dispatch)
      await purchaseDirectly({courseId}, token, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  return (
    <div className="flex items-center">
      <button className="bg-yellow-50 p-6 mt-10" onClick={() => handleBuyCourse()}>
        Buy Now
      </button>
    </div>
  )
}

export default CourseDetails