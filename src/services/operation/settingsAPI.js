import { toast } from "react-hot-toast";
import { settingsEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { setUser } from "../../slices/profileSlice";
import { logout } from "./authAPI"

const { UPDATE_PROFILE_API, CHANGE_PASSWORD_API, DELETE_PROFILE_API, UPDATE_DISPLAY_PICTURE_API } = settingsEndpoints;

export function updateProfile(token, formdata){
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try{
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formdata, {Authorization: `Bearer ${token}`})
      console.log("UPDATE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.profile.image
        ? response.data.profile.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.profile.firstName} ${response.data.profile.lastName}`
      dispatch(setUser(response.data.profile))
      localStorage.setItem("user", JSON.stringify({...response.data.profile, additionalDetail:response.data.additionalDetail, image:userImage}))
      toast.success("Profile Updated Successfully")
    } catch(err){
      console.log("UPDATE_PROFILE_API API ERROR............", err)
      toast.error(err.response.data.message)
    }
    toast.dismiss(toastId)
  }
}

export function updateDP(token, formdata){
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try{
      const response = await apiConnector("PUT", UPDATE_DISPLAY_PICTURE_API, formdata, {"Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`})
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Display Picture Updated Successfully")
      dispatch(setUser(response.data.data))
    } catch(err){
        console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", err)
        toast.error(err.response.data.message)
    }
    toast.dismiss(toastId)
  }
}

export async function updatePassword(token, formdata){
    const toastId = toast.loading("Loading...")
    try{
      await apiConnector("POST", CHANGE_PASSWORD_API, formdata, {Authorization: `Bearer ${token}`})
      toast.success("Password Changed Successfully")
    } catch(err){
      console.log("CHANGE_PASSWORD_API API ERROR............", err)
      toast.error(err.response.data.message)
    }
    toast.dismiss(toastId)
}

export function deleteProfile(token, navigate){
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try{
      await apiConnector("DELETE", DELETE_PROFILE_API, null, {Authorization: `Bearer ${token}`})
      toast.success("Proifle deleted Successfully")
      dispatch(logout(navigate))
    } catch(err){
      console.log("DELETE_PROFILE_API API ERROR............", err)
      toast.error(err.response.data.message)
    }
    toast.dismiss(toastId)
  }
}