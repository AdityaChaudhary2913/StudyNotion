import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operation/courseDetailAPI';
import ChipInput from './ChipInput';
import { MdNavigateNext } from "react-icons/md"
import IconBtn from "../../../../common/IconBtn"
import Upload from '../Upload';
import RequirementField from './RequirementField';
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { toast } from 'react-hot-toast';
import { COURSE_STATUS } from '../../../../../utils/constants';

const CourseInfo = () => {
  const {token} = useSelector((state) => state.auth)
  const { register, handleSubmit, setValue, getValues, formState:{errors} } = useForm();
  const dispatch = useDispatch();
  const { course, editCourse } = useSelector((state) => state.course)
  const [courseCategories, setCourseCategories] = useState([]);
  const getCategories = async () => {
    const categories = await fetchCourseCategories()
    if (categories.length > 0) {
      // console.log("categories", categories)
      setCourseCategories(categories)
    }
  }
  useEffect(() => {
    if(editCourse){
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseCategory", course.category)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }
    getCategories()
  }, []);
  const isFormUpdated = () => {
    const currentValues = getValues();
    console.log("Hello", currentValues)
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true
    }
    return false
  }
  const submitHandler = async (data) => {
    if(editCourse){
      if(isFormUpdated()){
        const currentValues = getValues();
        const formData = new FormData();
        formData.append("courseId", course._id)
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc)
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice)
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits)
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory)
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          )
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }
        const result = await editCourseDetails(formData, token)
        if(result){
          dispatch(setStep(2));
          dispatch(setCourse(result));
        }
      } else{
        toast.error("No changes made to form")
      }
    }
    else{
      const formData = new FormData()
      formData.append("courseName", data.courseTitle)
      formData.append("courseDescription", data.courseShortDesc)
      formData.append("price", data.coursePrice)
      formData.append("tag", JSON.stringify(data.courseTags))
      formData.append("whatYouWillLearn", data.courseBenefits)
      formData.append("category", data.courseCategory)
      formData.append("status", COURSE_STATUS.DRAFT)
      formData.append("instructions", JSON.stringify(data.courseRequirements))
      formData.append("thumbnailImage", data.courseImage)
      const result = await addCourseDetails(formData, token)
      if (result) {
        dispatch(setStep(2))
        dispatch(setCourse(result))
      }
    }
  }
  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">Course Title <sup className="text-pink-200">*</sup></label>
        <input
          name='courseTitle'
          id='courseTitle'
          type='text'
          placeholder='Enter your course title'
          {...register("courseTitle", {required:true})}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
        />
        {
          errors.courseTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Title is required
            </span>
          )
        }
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">Course Description <sup className="text-pink-200">*</sup></label>
        <input
          name='courseShortDesc'
          id='courseShortDesc'
          type='text'
          placeholder='Enter your course description'
          {...register("courseShortDesc", {required:true})}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
        />
        {
          errors.courseShortDesc && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Description is required
            </span>
          )
        }
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"

            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-700 !pl-10 p-[12px] text-richblack-5"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
          
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          defaultValue=""
          id="courseCategory"
          {...register("courseCategory",  { required: true })}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {
            courseCategories.map((category, index) => (
              <option key={index} value={category?.id}>
                {category?.name}
              </option>
            ))
          }
          {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
          )}
        </select>
      </div>
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />
      <div>
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 resize-x-none min-h-[130px]"
          id='courseBenefits'
          name='courseBenefits'
          placeholder='Enter benefits of the Course'
          {...register("courseBenefits", {required:true})}
        />
        {
          errors.courseBenefits && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Benefits of the course are required to mention!
            </span>
          )
        }
      </div>
      <RequirementField
        label="Prerequisites"
        name="courseRequirements"
        placeholder={`Enter the Requirements to persue this course`}
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
      <div className="flex justify-end gap-x-2">
        {
          editCourse && (
            <button
            onClick={() => dispatch(setStep(2))}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
            >
              Continue Without Saving
            </button>
          )
        }
        <IconBtn
          onClick={() => dispatch(setStep(2))}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}

export default CourseInfo