import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import { IoCloseSharp } from "react-icons/io5";
import { AiOutlineMenu } from "react-icons/ai";
import Sidebar from '../components/core/Dashboard/Sidebar';
import ConfirmationModel from '../components/common/ConfirmationModel';

const Dashboard = () => {
  const {loading:authLoading} = useSelector((state) => state.auth);
  const {loading:profileLoading} = useSelector((state) => state.profile);
  const [confirmationModel, setConfirmationModel] = useState(null);
  const [toggle, setToggle] = useState(false);
  if(profileLoading || authLoading){
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">Loading...</div>
    )
  }
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] text-white">
      <div className='hidden sm:block'>
        <Sidebar toggle="" setConfirmationModel="" />
      </div>
      <div className='sm:hidden absolute p-2 flex flex-1 justify-end items-center text-white' onClick={() => setToggle(!toggle)}>
          {!toggle ? (
						<div className="object-contain cursor-pointer">
							<AiOutlineMenu fontSize={23} fill="#AFB2BF" />
						</div>
					) : (
            <div className="object-contain cursor-pointer absolute z-50 top-4 left-4">
              <IoCloseSharp fontSize={25} fill="#AFB2BF" />
            </div>
					)}
          <div className={`${
							!toggle ? "hidden" : "flex"
						} z-40`}>
            <Sidebar toggle={toggle} setConfirmationModel={setConfirmationModel} />
          </div>
      </div>
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
      {confirmationModel && <ConfirmationModel modelData={confirmationModel} />}
    </div>
  )
}

export default Dashboard