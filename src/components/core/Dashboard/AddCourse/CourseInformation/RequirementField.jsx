import React, { useEffect, useState } from 'react'
import { ImCancelCircle } from "react-icons/im"
import { useSelector } from 'react-redux';

const RequirementField = ({label, name, register, placeholder, errors, setValue, getValues}) => {
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState([]);
  const { editCourse, course } = useSelector((state) => state.course)
  const addHandler = () => {
    if(requirement){
      setRequirementList([...requirementList, requirement])
      setRequirement("");
    }
  }
  const removeHandler = (i) => {
    const newList = requirementList.filter((_, ind) => ind !== i)
    setRequirementList(newList)
  }
  const handleKeyDown = (event) => {
    if(event.key === 'Enter')
      addHandler()
  }
  useEffect(() => {
    if (editCourse) {
      setRequirementList(course?.instructions)
    }
    register(name, { required: true, validate: (value) => value.length > 0 })
  }, [])

  useEffect(() => {
    setValue(name, requirementList)
  }, [requirementList])
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col items-start space-y-2">
        <input
          name={name}
          id={name}
          placeholder={placeholder}
          value={requirement}
          onKeyDown={handleKeyDown}
          onChange={(e)=> setRequirement(e.target.value)}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
        />
        <button type="button" className="font-semibold text-yellow-50" onClick={addHandler}>
          Add
        </button>
      </div>
      {
        requirementList.length > 0 && (
          <ul className="mt-2 list-inside list-disc">
            {
              requirementList.map((require, index) => (
                <li key={index} className="flex items-center text-richblack-5">
                  <span>{require}</span>
                  <button type="button" className="ml-2 text-xs text-pure-greys-300" onClick={()=> removeHandler(index)}><ImCancelCircle /></button>
                </li>
              ))
            }
          </ul>
        ) 
      }
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}

export default RequirementField