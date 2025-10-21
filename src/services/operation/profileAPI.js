import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from '../apis'


export async function getUserEnrolledCourses(token){
  const { GET_USER_ENROLLED_COURSES_API } = profileEndpoints;
  const toastId = toast.loading("Loading...")
  let result = []
  try{
    const response = await apiConnector("GET", GET_USER_ENROLLED_COURSES_API, null, {Authorization : `Bearer ${token}`})
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch(err){
    toast.error(err.response.data.message)
  }
  toast.success("Courses Loaded Successfully")
  toast.dismiss(toastId)
  return result
}

export async function getInstructorData(token) {
  const { GET_INSTRUCTOR_DATA_API } = profileEndpoints;
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    })
    result = response?.data?.courses
  } catch (error) {
    toast.error(error.response.data.message)
  }
  toast.dismiss(toastId)
  return result
}