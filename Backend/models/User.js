 const mongoose = require('mongoose');
 const bcrypt = require ('bcrypt');
 

// User ka schema ka structure

const userSchema= new mongoose.Schema({
    email:{type:String,unique:true,required:true,lowercase:true,trim:true,match: /^\S+@\S+\.\S+$/},
    password:{type:String,required:true},
    role:{type:String,enum:['customer','staff'],default:'customer'},
    otp:{type:String,default:null},
    otpExpiration:{type:Date,default:null},
    verified:{type:Boolean,default:false},
    token:{type:String}

})

// password ko database mai store karna se pehle use hash karna chahiye
 
userSchema.pre('save',async function( next){
   const user=this;
   if(!user.isModified('password')) return next();
   const hash= await bcrypt.hash(user.password,10);
   user.password=hash;
   if(!user.isModified('token')) return next();
   const hashToken= await bcrypt.hash(user.token,10);
   user.token=hashToken;
   next();
})
 
 userSchema.methods.comparePassword=async function (password){
   return bcrypt.compare(password,this.password);
}

userSchema.methods.compareToken= async function(t){
   if (!this.token) {
      return false;
  }
   return bcrypt.compare(t,this.token);
}
const User=mongoose.model('User',userSchema);
module.exports =User;