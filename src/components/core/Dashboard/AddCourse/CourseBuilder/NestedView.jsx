import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"

const NestedView = ({handleChangeEditSectionName}) => {
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [addSubSection, setAddSubsection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  const handleDeleteSection = async (sectionId) => () => {

  }
  return (
    <div>
      <div className="rounded-lg bg-richblack-700 p-6 px-8" id="nestedViewContainer">
        {
          course?.courseContent?.map((section) => (
            <details key={section._id} open>
              <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                <div className="flex items-center gap-x-3">
                  <RxDropdownMenu className="text-2xl text-richblack-50" />
                  <p className="font-semibold text-richblack-50">
                    {section.sectionName}
                  </p>
                </div>
                <div className="flex items-center gap-x-3">
                  <button onClick={handleChangeEditSectionName(section._id, section.sectionName)}>
                    <MdEdit className="text-xl text-richblack-300" />
                  </button>
                  <button onClick={() => setConfirmationModal(
                    {text1: "Delete this Section?",
                    text2: "All the lectures in this section will be deleted",
                    btn1Text: "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: () => handleDeleteSection(section._id),
                    btn2Handler: () => setConfirmationModal(null),}
                  )}>
                    <RiDeleteBin6Line className="text-xl text-richblack-300" />
                  </button>
                  <span className="font-medium text-richblack-300">|</span>
                  <AiFillCaretDown className={`text-xl text-richblack-300`} />
                </div>
              </summary>
              <div className="px-6 pb-4">
                {
                  section?.subSection?.map((data) => (
                    <div key={data?._id} onClick={() => setViewSubSection(data)} className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2">
                      <div className="flex items-center gap-x-3 py-2 ">
                        <RxDropdownMenu className="text-2xl text-richblack-50" />
                        <p className="font-semibold text-richblack-50">
                          {data.title}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </details>
          ))
        }
      </div>
    </div>
  )
}

export default NestedView