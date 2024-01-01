import React, { useState } from 'react'
import ImageUploader from './ImageUploader'
import PersonalDataUploader from './PersonalDataUploader'
import PasswordUpdater from './PasswordUpdater'
import AccountDeleter from './AccountDeleter'
import ConfirmationModel from '../../../common/ConfirmationModel'

const Settings = () => {
  const [confirmationModel, setConfirmationModel] = useState(null);
  return (
    <>
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">Edit Profile</h1>
      <ImageUploader/>
      <PersonalDataUploader />
      <PasswordUpdater />
      <AccountDeleter setConfirmationModel={setConfirmationModel} />
    </div>
      {confirmationModel && <ConfirmationModel modelData={confirmationModel} />}
    </>
  )
}

export default Settings