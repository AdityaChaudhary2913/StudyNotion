import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operation/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';

const EnrolledCourses = () => {
  const { token }= useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const getEnrolledCourses = async () => {
    try{
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch(err){
      console.log('Error fetching enrolled courses', err);
    }
  }
  useEffect(()=> {
    getEnrolledCourses();
  },[]);
  return (
    <div className='text-white'>
      <div>Enrolled Courses</div>
      {
        !enrolledCourses ? (<div className='flex justify-center items-center text-5xl text-white h-[70vh]'>Loading...</div>) : 
        !enrolledCourses.length ? (<p>You Have Not Enrolled In Any Of The Courses Yet!</p>) :
        (<div>
          <div>
            <p>Course Name</p>
            <p>Duration</p>
            <p>Progress</p>
          </div>
          {
            enrolledCourses.map((course, index) => (
              <div key={index}>
                <div>
                  <img  src={course.thumbnail}/>
                    <div>
                      <p>{course.courseName}</p>
                      <p>{course.courseDescription}</p>
                    </div>
                  </div>
                <div>
                  {course?.totalDuration}
                </div>
                <div>
                  <p>Progress: {course.progressPercentage || 0}%</p>
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height='8px'
                    isLabelVisible={false}
                  />
                </div>                
              </div>
            ))
          }
        </div>)
      }
    </div>
  )
}

export default EnrolledCourses