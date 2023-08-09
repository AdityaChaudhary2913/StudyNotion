const mongoose=require('mongoose');

const profileSchema= new mongoose.Schema({
  gender: {
    type:String,
  },
  about: {
    type:String,
    trim:true,
  },
  dateOfBirth: {
    type:String,
  },
  contactNumber: {
    type:String,
    trim:true,
  }
})
module.exports=mongoose.model("Profile", profileSchema);