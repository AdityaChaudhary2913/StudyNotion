import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import { FaArrowRight } from 'react-icons/fa';
import HighlightText from './HighlightText';
import CTAbutton from './CTAbutton';

const InstructorSection = () => {
  return (
		<div className='flex items-center mt-14 mb-10 mx-auto flex-wrap'>
			<div className='md:w-[50%]'>
				<img src={Instructor} alt='' />
			</div>
			<div className='flex flex-col gap-10 md:w-[50%]'>
				<div className='text-4xl font-semobold w-[50%]'>
					Become an <HighlightText text={"Instructor"} />
				</div>
				<div className='font-medium text-[16px] w-[80%] text-richblack-300'>
					Instructors from around the world teach millions of students on
					StudyNotion. We provide the tools and skills to teach what you love.
				</div>
				<div className='w-fit ml-20 md:ml-0'>
					<CTAbutton active={true} linkto={"/signup"}>
						<div className="flex items-center gap-3">
							Start Teaching today
							<FaArrowRight />
						</div>
					</CTAbutton>
				</div>
			</div>
		</div>
	);
}

export default InstructorSection