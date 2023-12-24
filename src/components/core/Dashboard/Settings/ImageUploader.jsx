import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn';
import { FiUpload } from "react-icons/fi"
import { toast } from 'react-hot-toast';
import { updateDP } from '../../../../services/operation/settingsAPI';

const ImageUploader = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false)
  const [imgFile, setImgFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(user?.image);
  const dispatch = useDispatch();
  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSrc(reader.result)
    }
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if(file){
      setImgFile(file);
      previewFile(file)
    }
  }
  const handleFileUpload = () => {
    try{
      setLoading(true)
      const formData = new FormData()
      formData.append("displayPicture", imgFile)
      dispatch(updateDP(token, formData))
    } catch(err){
      console.log("ERROR MESSAGE - ", err.message)
    }
  }
  const handleClick = () => {
    fileInputRef.current.click();
  }
  return (
    <div className='flex gap-5 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12'>
      <img src={previewSrc} alt={`profile-${user?.firstName}`} className="aspect-square w-[78px] rounded-full object-cover" />
      <div className='flex-row'>
        <p className="text-lg font-medium text-richblack-5 mb-1">Change Profile Picture</p>
        <div className='flex gap-5'>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/gif, .png"
          />
          <button
            onClick={handleClick}
            disabled={loading}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Select
          </button>
          <IconBtn text="Upload" onclick={handleFileUpload} >{!loading && (<FiUpload className="text-lg text-richblack-900" />)}</IconBtn>
        </div>
      </div>
    </div>
  )
}

export default ImageUploader

