import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Footer from "./components/common/Footer";
import Contact from "./pages/Contact";
import OpenRoute from "./components/core/Auth/OpenRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { ACCOUNT_TYPE } from "./utils/constants";
import Myprofile from "./components/core/Dashboard/Myprofile";
import Settings from "./components/core/Dashboard/Settings/Settings";
import Cart from "./components/core/Dashboard/Cart/Index";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import { useSelector } from "react-redux";
import Error from "./pages/Error";
import AddCourse from "./components/core/Dashboard/AddCourse/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/Instructor";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

function App() {
  const { token } = useSelector((state) => state.auth)
  const [userData, setUserData] = useState(null)  
  useEffect(()=> {
    const setData = async() => {
      const decodedToken = await jwtDecode(token)
      if(decodedToken !== userData){
        setUserData(decodedToken)
      }
    }
    if(token){
      setData();
    }
  }, [token])
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/> 
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<OpenRoute><Login/></OpenRoute>} />
        <Route path="/signup" element={<OpenRoute><Signup/></OpenRoute>} />
        <Route path="/forgot-password" element={<OpenRoute><ForgotPassword/></OpenRoute>} />
        <Route path="/update-password/:id" element={<OpenRoute><UpdatePassword/></OpenRoute>} />
        <Route path="/verify-email" element={<OpenRoute><VerifyEmail/></OpenRoute>} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/catalog/:catalogName" element={<Catalog />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route path="/dashboard/my-profile" element={<Myprofile />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          {
            userData?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/cart" element={<Cart />} />
                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
              </>
            )
          }
          {
            userData?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="/dashboard/add-course" element={<AddCourse />} />
                <Route path="/dashboard/my-courses" element={<MyCourses />} />
                <Route path="/dashboard/instructor" element={<Instructor />} />
                <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
              </>
            )
          }
        </Route>
        <Route element={<PrivateRoute><ViewCourse /></PrivateRoute>}>
          {
            userData?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route
                  path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                  element={<VideoDetails />}
                />
              </>
            )
          }
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
