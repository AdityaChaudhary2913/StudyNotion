import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"
import { IoCloseSharp } from "react-icons/io5";
import { AiOutlineMenu } from "react-icons/ai";
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from "../slices/viewCourseSlice"
import { getFullDetailsOfCourse } from "../services/operation/courseDetailAPI"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"

const ViewCourse = () => {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    ;(async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos))
      let lectures = 0
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
    })()
  })
  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <div className='hidden sm:block'>
          <VideoDetailsSidebar setReviewModal={setReviewModal} />
        </div>
        <div className='sm:hidden absolute p-2 flex flex-1 justify-end items-center text-white'>
          {!toggle ? (
						<div className="object-contain cursor-pointer">
							<AiOutlineMenu fontSize={23} fill="#AFB2BF" />
						</div>
					) : (
            <div className="object-contain cursor-pointer absolute z-50 top-4 left-4">
              <IoCloseSharp fontSize={25} fill="#AFB2BF" />
            </div>
					)}
          <div className={`${
							!toggle ? "hidden" : "flex"
						} z-40`}>
            <VideoDetailsSidebar toggle={toggle} setToggle={setToggle} setReviewModal={setReviewModal} />
          </div>
      </div>
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}

export default ViewCourse