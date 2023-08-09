import React, { useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUploadCloud } from "react-icons/fi"
import { Player } from "video-react"

const Upload = ({name, label, register, setValue, errors, editData = null, video = false, viewData = null}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  const [previewSrc, setPreviewSrc] = useState(viewData ? viewData : editData ? editData : "")
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if(file){
      previewFile(file)
      setSelectedFile(file)
    }
  }
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSrc(reader.result)
    }
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video ?
    { "image/*": [".jpeg", ".jpg", ".png"] } :
    { "video/*": [".mp4"] },
    onDrop,
  })
  useEffect(()=> {
    register(name, {required:true})
  }, [register])
  useEffect(()=> {
    setValue(name, selectedFile)
  }, [selectedFile, setValue])
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}>
          {
            previewSrc ? 
              (<div className="flex w-full flex-col p-6">
                {
                  !video ? 
                    (<img src={previewSrc} alt='Preview' className="h-full w-full rounded-md object-cover" />)
                    : 
                    (<Player aspectRatio="16:9" playsInline src={previewSrc} />)
                }
                {
                  !viewData && (
                    <button type="button" onClick={() => {setPreviewSrc(null); setSelectedFile(null); setValue(name, null)}} className="mt-3 text-richblack-400 underline">
                      Cancel
                    </button>
                  )
                }
              </div>) 
              : 
              (<div className="flex w-full flex-col items-center p-6" {...getRootProps()}>
                <input ref={inputRef} {...getInputProps()} />
                <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                  <FiUploadCloud className="text-2xl text-yellow-50" />
                </div>
                <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                  Drag and drop an {!video ? "image" : "video"}, or click to{" "}
                  <span className="font-semibold text-yellow-50">Browse</span> a
                  file
                </p>
                <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
                  <li>Aspect ratio 16:9</li>
                  <li>Recommended size 1024x576</li>
                </ul>
              </div>)
          }
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}

export default Upload