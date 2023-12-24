import { toast } from "react-hot-toast";
import { endpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { resetCart } from "../../slices/cartSlice";


const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
  ) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })
      console.log("SIGNUP API RESPONSE............", response)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error(error.response.data.message)
      navigate("/signup")
    }
    toast.dismiss(toastId)
  }
}

export function sendOtp(email, navigate){
  return async(dispatch) => {
    const toastId = toast.loading("Loading...");
    try{
      console.log(email);
      const response = await apiConnector("POST", SENDOTP_API, {email})
      console.log("SENDOTP API RESPONSE............", response)
      console.log(response.data.success)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch(err){
      console.log("SENDOTP API ERROR............", err)
      toast.error(err.response.data.message)
    }
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try{
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })
      console.log("LOGIN API RESPONSE............", response)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Login Successful")
      dispatch(setToken(response.data.token));
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({...response.data.user, image:userImage}));
      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("user", JSON.stringify(response.data.user))
      navigate("/dashboard/my-profile")
    } catch(err){
      console.log("LOGIN API ERROR............", err)
      toast.error(err.response.data.message)
    }
    toast.dismiss(toastId)
  }
}

export function logout(navigate){
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate('/');
  }
}

export function getResetPasswordToken(email, setEmailSent){
  return async(dispatch) => {
    try{
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {email});
      console.log("RESET PASSWORD TOKEN RESPONSE....", response);
      if(!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch(err){
      console.log("RESET PASSWORD TOKEN Error", err);
      toast.error(err.response.data.message);
    }
  }
}

export function resetPassword(password, confirmPassword, token, navigate){
  return async (dispatch) => {
    try{
      const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});
      console.log("RESET Password RESPONSE ... ", response);
      if(!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Password has been reset successfully");
    } catch(err){
      console.log("RESET PASSWORD TOKEN Error", err);
      toast.error(err.response.data.message);
    }
  }
}
