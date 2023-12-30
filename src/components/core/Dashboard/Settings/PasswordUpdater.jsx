import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import IconBtn from '../../../common/IconBtn'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updatePassword } from '../../../../services/operation/settingsAPI'

const PasswordUpdater = () => {
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const {token} = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: {errors} } = useForm();
  const formSubmit = async (data) => {
    try{
      await updatePassword(token, data)
    } catch(err){}
  }
  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor='oldPassword'>Current Password</label>
            <input
              type={ showOldPassword? "text" : "password"}
              name='oldPassword'
              id='oldPassword'
              placeholder='Enter current password'
              {...register("oldPassword", {required:true})}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
            />
            <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-[43px] z-[10] cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.oldPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Current Password.
                </span>
              )}
          </div>
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor='newPassword'>New Password</label>
            <input
              type={ showNewPassword? "text" : "password"}
              name='newPassword'
              id='newPassword'
              placeholder='Enter new password'
              {...register("newPassword", {required:true})}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
            />
            <span
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-[43px] z-[10] cursor-pointer"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.newPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your New Password.
                </span>
              )}
          </div>
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor='confirmNewPassword'>Confirm New Password</label>
            <input
              name='confirmNewPassword'
              id='confirmNewPassword'
              placeholder='Enter New password again'
              type={ showConfirmNewPassword? "text" : "password"}
              {...register("confirmNewPassword", {required:true})}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
            />
            <span
                onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                className="absolute right-3 top-[43px] z-[10] cursor-pointer"
              >
                {showConfirmNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.confirmNewPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your New Password again.
                </span>
              )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile")
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Update" />
        </div>
      </div>
    </form>
  )
}

export default PasswordUpdater