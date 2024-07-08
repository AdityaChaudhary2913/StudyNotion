import React, { useState } from 'react'
import SignupForm from './SignupForm';
import LoginForm from './LoginForm'
import frameImg from '../../../assets/Images/frame.png'

const Template = ({title, description1, description2, formType, image}) => {
  const [formData, setFormData] = useState({email:"", password:""})
  const userG = () => {
    setFormData({email: "programmingid1306@gmail.com", password: "1234"})
  }
  const instG = () => {
    setFormData({email: "girishkumari1985@gmail.com", password: "1234"})
  }
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
        <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            {title}
          </h1>
          <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
            <span className="text-richblack-100">{description1}</span>{" "}
            <span className="font-edu-sa font-bold italic text-blue-100">
              {description2}
            </span>
          </p>
          <div className='flex'>
            <div onClick={userG} className='group mt-12 p-1 mx-auto rounded-full text-richblack-200 bg-richblack-800 font-bold transition-all duration-200 hover:scale-95 w-fit cursor-pointer'>
              <div className='flex items-center gap-2 rounded-full px-5 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                <p>Use Guest User</p>
              </div>
            </div>
            <div onClick={instG} className='group mt-12 p-1 mx-auto rounded-full text-richblack-200 bg-richblack-800 font-bold transition-all duration-200 hover:scale-95 w-fit cursor-pointer'>
              <div className='flex items-center gap-2 rounded-full px-5 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                <p>Use Guest Instructor</p>
              </div>
            </div>
          </div>
          {formType === "signup" ? <SignupForm/> : <LoginForm formData={formData} setFormData={setFormData} />}
        </div>
        <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
          <img
            src={frameImg}
            alt="Pattern"
            width={558}
            height={504}
            loading="lazy"
          />
          <img
            src={image}
            alt="Students"
            width={558}
            height={504}
            loading="lazy"
            className="absolute -top-4 right-4 z-10"
          />
        </div>
      </div>
    </div>
  )
}

export default Template