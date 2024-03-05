const UserProfile = require('../models/userProfile');
const User= require('../models/User');

exports.postProfile=async (req,res)=>{
  const userId=req.user._id;

 try   {
     const{name,surname,mobileNumber,address}=req.body;

    const userProfile=new UserProfile({
        user:userId,
        name,
        surname,
        mobileNumber,
        address
    })
    await userProfile.save();
    await User.findByIdAndUpdate(userId,{profile:userProfile._id});
    res.status(201).json({message:'User profile completed successfully.'});
   } catch(err){
    console.log(err);
    res.status(500).json({error:'Internal Server Error'});
   }
}
exports.updateProfile = async(req,res)=>{
    try{
        const userId= req.user._id;
        const {name,surname,mobileNumber,address}=req.body;
      const userProfile = await UserProfile.findOneAndUpdate(
        {user:userId},
        {name,surname,mobileNumber,address},
        {new:true,runValidators:true}
      );
      if(!userProfile){
        return res.status(404).json({message:'User Profile Not found'});
      }

      res.json({message:'User profile updated successfully '});
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
}