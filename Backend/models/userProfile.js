const mongoose= require('mongoose');

const userProfileSchema = new mongoose.Schema({
    user: { type:mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true,
    unique:true
},
    name:{type :String},
    surname:{type:String},
    mobileNumber:{type:String},
    address:{type:String},

})
const UserProfile = mongoose.model('UserProfile',userProfileSchema);
module.exports = UserProfile;