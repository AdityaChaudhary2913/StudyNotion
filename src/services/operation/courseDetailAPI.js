import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../apis";
import { toast } from "react-hot-toast"
const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints

export const fetchCourseCategories = async () => {
  let result = [];
  try{
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);
    console.log("COURSE_CATEGORIES_API API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch(error){
    console.log("COURSE_CATEGORY_API API ERROR............", error)
    toast.error(error.message)
  }
  return result;
}

export const addCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...")
  try{
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {"Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`})
    console.log("Create COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details")
    }
    toast.success("Course Details Added Successfully")
    result = response?.data?.data
  } catch(err){
    console.log("ADD COURSE API ERROR............", err)
    toast.error(err.message)
  }
  toast.dismiss(toastId)
  return result
}

export const editCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...")
  try{
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {"Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`})
    console.log("EDIT COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details")
    }
    toast.success("Course Details Updated Successfully")
    result = response?.data?.data
  } catch(err){
    console.log("EDIT COURSE API ERROR............", err)
    toast.error(err.message)
  }
  toast.dismiss(toastId)
  return result
}