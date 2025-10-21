import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import IconBtn from '../../../common/IconBtn';
import { updateProfile } from '../../../../services/operation/settingsAPI';

const genders = ["Male", "Female", "Prefer not to say", "Other"];

const PersonalDataUploader = () => {
  const {user} = useSelector((state) => state.profile)
  const {token} = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {register, handleSubmit, formState: {errors}} = useForm();
  const submitForm = async (formdata) => {
    try{
      dispatch(updateProfile(token, formdata))
    } catch(err){}
  }
  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">Profile Information</h2>
        <div className='flex flex-col gap-5 lg:flex-row'>
          <div className='flex flex-col gap-2 lg:w-[48%]'>
            <label htmlFor='firstName'>
              First Name
            </label>
            <input
              name='firstName'
              id='firstName'
              type='text'
              placeholder="Enter first name"
              {...register("firstName", {required: true})}
              defaultValue={user?.firstName}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
            />
            {
              errors.firstName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
									Please enter your first name.
								</span>
              )
            }
          </div>
          <div className='flex flex-col gap-2 lg:w-[48%]'>
            <label htmlFor='lastName'>
              Last Name
            </label>
            <input
              name='lastName'
              id='lastName'
              type='text'
              placeholder="Enter last name"
              {...register("lastName", {required: true})}
              defaultValue={user?.lastName}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
            />
            {
              errors.lastName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
									Please enter your last name.
								</span>
              )
            }
          </div>
        </div>
        <div className='flex flex-col gap-5 lg:flex-row'>
          <div className='flex flex-col gap-2 lg:w-[48%]'>
            <label htmlFor='dateOfBirth'>
              Date Of Birth
            </label>
            <input
              name='dateOfBirth'
              id='dateOfBirth'
              type='date'
              placeholder="Enter date Of birth"
              {...register("dateOfBirth", {
                required: {
                  value: true,
                  message: "Please enter your date of birth"
                },
                max: {
                  value: new Date().toISOString().split("T")[0],
                  message: "Date of Birth cannot be in the future.",
                },
                })
              }
              defaultValue={user?.additionalDetails?.dateOfBirth}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
            />
            {
              errors.dateOfBirth && (
                <span className="-mt-1 text-[12px] text-yellow-100">
									{errors.dateOfBirth.message}
								</span>
              )
            }
          </div>
          <div className='flex flex-col gap-2 lg:w-[48%]'>
            <label htmlFor='gender'>Gender</label>
            <select 
              name='gender'
              id='gender'
              placeholder='Enter your gender'
              type='text'
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
              {...register("gender", {required:true})}
              defaultValue={user?.additionalDetails?.gender}
            >
              {
                genders.map((element, index) => (
                  <option key={index} value={element} >
                    {element}
                  </option>
                ))
              }
            </select>
            {errors.gender && (
							<span className="-mt-1 text-[12px] text-yellow-100">
								Please enter your Date of Birth.
							</span>
						)}
          </div>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row">
					<div className="flex flex-col gap-2 lg:w-[48%]">
							<label htmlFor="contactNumber" className="lable-style">
								Contact Number
							</label>
							<input
								type="tel"
								name="contactNumber"
								id="contactNumber"
								placeholder="Enter Contact Number"
								style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
								{...register("contactNumber", {
									required: {
										value: true,
										message: "Please enter your Contact Number.",
									},
									maxLength: { value: 12, message: "Invalid Contact Number" },
									minLength: { value: 10, message: "Invalid Contact Number" },
								})}
								defaultValue={user?.additionalDetails?.contactNumber}
							/>
							{errors.contactNumber && (
								<span className="-mt-1 text-[12px] text-yellow-100">
									{errors.contactNumber.message}
								</span>
							)}
					</div>
					<div className="flex flex-col gap-2 lg:w-[48%]">
							<label htmlFor="about" className="lable-style">
								About
							</label>
							<input
								type="text"
								name="about"
								id="about"
								placeholder="Enter Bio Details"
								style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
								{...register("about", { required: true })}
								defaultValue={user?.additionalDetails?.about}
							/>
							{errors.about && (
								<span className="-mt-1 text-[12px] text-yellow-100">
									Please enter your About.
								</span>
							)}
					</div>
				</div>
      <div className='flex justify-end gap-2'>
          <Link
            to='/dashboard/my-profile'
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </Link>
          <IconBtn type='submit' text="Save"/>
      </div>
      </div>
    </form>
  )
}

export default PersonalDataUploader