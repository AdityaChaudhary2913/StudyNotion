import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import CountryCode from '../../data/countrycode.json'
import { apiConnector } from '../../services/apiConnector';
import { contactusEndpoint } from '../../services/apis';
import { toast } from 'react-hot-toast';

const ContactUsForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessfull }
  } = useForm();
  const submitForm = async (data) => {
    console.log("Logging Data", data)
    try{
      const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
      console.log("Logging response", response);
      toast.success("Message Sent");
    } catch(err){
        console.log("Error: ", err)
        console.log("Error while submitting form!");
        toast.error("Unable to send message");
    }
  }
  useEffect(() => {
    if(isSubmitSuccessfull){
      reset({
        firstName:"",
        lastName:"",
        email:"",
        phoneNumber:"",
        message:"",
      })
    }
  }, [reset, isSubmitSuccessfull])
  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit(submitForm)}>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor='firstName' className='label-style'>First Name</label>
          <input 
            name='firstName'
            type='text'
            id='firstName'
            placeholder='Enter first name...'
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
            {...register("firstName", {required:true})}
          />
          {
            errors.firstName && (
              <span className="-mt-1 text-[12px] text-yellow-100">Please enter first name!</span>
            )
          }
        </div>
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor='lastName' className='label-style'>Last Name</label>
          <input
            type='text'
            name='lastName'
            id='lastName'
            placeholder='Enter last name...'
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
            {...register("lastName", {required:true})}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:w-[48%]">
        <label htmlFor='email' className='label-style'>Email Id</label>
        <input 
          name='email'
          type='email'
          id='email'
          placeholder='Enter email id...'
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
          {...register("email", {required:true})}
        />
        {
          errors.email && (
            <span className="-mt-1 text-[12px] text-yellow-100">Please enter email id!</span>
          )
        }
      </div>
      <div>
        <label htmlFor="phoneNumber" className="lable-style">Phone Number</label>
        <div className='flex gap-5'>
          <div className="flex w-[81px] flex-col gap-2">
            <select
              name='dropDown'
              id='dropDown'
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
              {...register("countrycode", {required:true})}
            >
              {
                CountryCode.map((element, index) => (
                  <option key={index} value={element.code}>
                    {element.code}-{element.country}
                  </option>
                ))
              }
            </select>
          </div>
          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type='number'
              name='phoneNumber'
              id='phoneNumber'
              placeholder='Enter your number...'
              {...register("phoneNumber", {
                required: { value:true, message:"Please enter your phone number!" },
                maxLength: { value:12, message:"Invalid number!" },
                minLength: { value:10, message:"Invalid number!" },
              })}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
            />
            {
              errors.phoneNumber && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.phoneNumber.message}
                </span>
              )
            }
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="lable-style">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="7"
          placeholder="Enter your message here"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Message.
          </span>
        )}
      </div>
      <button
          type="submit"
          className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
          ${"transition-all duration-200 hover:scale-95 hover:shadow-none"}  disabled:bg-richblack-500 sm:text-[16px] `}
        >
          Send Message
      </button>
    </form>
  )
}

export default ContactUsForm