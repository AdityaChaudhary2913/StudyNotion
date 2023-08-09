import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/homepage/HighlightText';
import CTAbutton from '../components/core/homepage/CTAbutton';
import Banner from '../assets/Images/banner.mp4';
import CodeBlocks from '../components/core/homepage/CodeBlocks';
import TimelineSection from '../components/core/homepage/TimelineSection';
import LearningLanguageSection from '../components/core/homepage/LearningLanguageSection';
import InstructorSection from '../components/core/homepage/InstructorSection';
import ExploreMore from '../components/core/homepage/ExploreMore';



const Home = () => {
  return (
    <div>

      {/* Section 1 */}
      <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>
        <Link to="/signup">
          <div className='group mt-16 p-1 mx-auto rounded-full text-richblack-200 bg-richblack-800 font-bold transition-all duration-200 hover:scale-95 w-fit'>
            <div className='flex items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
              <p>Become and Instructor</p>
              <FaArrowRight/>
            </div>
          </div>
        </Link>
        <div className='text-center text-4xl font-semibold mt-7'>
          Empower Your Future with <HighlightText text={"Coding Skills"}/>
        </div>
        <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'> 
          With our online coding courses, you can learn at your own pace, 
          from anywhere in the world, and get access to a wealth of resources, 
          including hands-on projects, quizzes, and personalized feedback 
          from instructors.
        </div>
        <div className='flex gap-7 mt-8'>
          <CTAbutton active={true} linkto={"/signup"}>Learn More</CTAbutton>
          <CTAbutton active={false} linkto={"login"}>Book a Demo</CTAbutton>
        </div>
        <div className='mx-3 my-12 shadow-blue-200 w-[80%] drop-shadow-lg'>
          <video muted loop autoPlay className='grad'> <source src={Banner} type='video/mp4'/> </video>
        </div>

        {/* Code Section 1 */}
        <div>
          <CodeBlocks
            position={'lg:flex-row'}
            heading={<div className='text-4xl font-semibold'>Unlock your <HighlightText text={"coding potential"}/> with our online courses</div>}
            subheading={<div>Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.</div>}
            ctabtn1={
              {
                btnText: "try it yourself",
                linkto: '/signup',
                active: true
              }
            }
            ctabtn2={
              {
                btnText: "Learn More",
                linkto: '/login',
                active: false
              }
            }
            codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n</head>\n<body>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>`}
          />
        </div>

        {/* Code Section 2 */}
        <div>
          <CodeBlocks
            position={'lg:flex-row-reverse'}
            heading={<div className='text-4xl font-semibold'>Start <HighlightText text={"coding in seconds"}/></div>}
            subheading={<div>Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson.</div>}
            ctabtn1={
              {
                btnText: "Continue Lesson",
                linkto: '/login',
                active: true
              }
            }
            ctabtn2={
              {
                btnText: "Learn More",
                linkto: '/signup',
                active: false
              }
            }
            codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n</head>\n<body>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>`}
          />
        </div>

        <ExploreMore/>
        <br />
        <br />
        <br /><br /><br /><br />
      </div>

      {/* Section 2 */}
      <div className='bg-pure-greys-5 text-richblack-700'>
        <div className='homepageBG h-[333px]'>
          <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto'>
            <div className='h-[150px]'></div>
            <div className='md:h-[50px]'></div>
            <div className='flex flex-row gap-7 text-white items-center'>
              <CTAbutton active={true} linkto={'/signup'}>
                <div className='flex items-center gap-3'>Explore Full Catalog <FaArrowRight/></div>
              </CTAbutton>
              <CTAbutton active={false} linkto={'/signup'}>Learn More</CTAbutton>
            </div>
          </div>
        </div>
        <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-16 mx-auto'>
          <div className='flex flex-wrap'>
            <div className='md:w-[50%] font-semibold text-4xl'>
              Get the skills you need for a <HighlightText text={"Job that is in demand"}/>
            </div>
            <div className='flex flex-col gap-5 md:w-[50%]'>
              The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
              <div className='lg:w-[40%]'>
                <CTAbutton active={true} linkto={'/signup'}>Learn More</CTAbutton>
              </div>
            </div>
          </div>
          <TimelineSection/>
          <LearningLanguageSection/>
        </div>
      </div>

      {/* Section 3 */}
      <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white">
        <InstructorSection/>
        <h2 className="text-center text-4xl font-semobold mt-10">
					Reviews from Other Learners
				</h2>
      </div>
    </div>
  )
}

export default Home