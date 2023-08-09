import React from 'react'
import ImageUploader from './ImageUploader'
import PersonalDataUploader from './PersonalDataUploader'
import PasswordUpdater from './PasswordUpdater'
import AccountDeleter from './AccountDeleter'

const Settings = () => {
  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">Edit Profile</h1>
      <ImageUploader/>
      <PersonalDataUploader />
      <PasswordUpdater />
      <AccountDeleter />
    </div>
  )
}

export default Settings