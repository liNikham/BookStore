const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt= require('bcrypt');
const User= require('../models/User');
const dotenv=require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
exports.signup= async (req,res)=>{
    try{

     const {email,password,role} = req.body;
    const existingUser = await User.findOne({email});
    
    // check kiya kya already user exist kar raha kya
    if(existingUser){
      return  res.status(400).json({error:'Email already exists'});

    }
    // otp generate kiya 
      const otp = Math.floor(100000 + Math.random()*9000000).toString();
     const otpExpiration=new Date();
     otpExpiration.setMinutes(otpExpiration.getMinutes()+2);
     // ab ye jo otp create kiya wo user ko bhejna hai
      const transporter =nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.SMTP_SECRET,
        }
      });
      const mailOptions ={
        from:process.env.EMAIL_USER,
        to:email,
        subject:'Verification Code for Bookstore',
        text:`Your Verification code is ${otp},`
      };
      await transporter.sendMail(mailOptions);
      const user=new User({email,password,role,otp,otpExpiration});
      await  user.save();
      const tokenPayload={
        email:email
    }

    const token=jwt.sign(tokenPayload,process.env.JWT_SECRET);
     return  res.status(201).json({message:'Verification code sent successfully on your email',token});
    }
    catch(error){
      console.log(error);
     return res.status(500).json({error:'Internal Server Error in sign up'});
    }
}
 exports.signin = async(req,res)=>{
     try{
    const {email,password,role}=req.body;
    
     const user =await User.findOne({email});
     // pehle dekh bhai user exist karta hai kya
     if(!user){
        return res.status(500).json({error:'Invalid credentials'});
     }
     // ab dekh password match karta hai 
      const isMatch= user.comparePassword(password);
      if(!isMatch){
        return res.status(401).json({message:'Invalid password'});
      }
      const token = jwt.sign({
        userId:user._id,
        role:role,
      },process.env.JWT_SECRET);
      res.cookie('token', token, { httpOnly: true }); 
      
     return res.status(200).json({message:'Login Successful',token});
     }
    catch(error){
        console.log(error);
      return  res.status(500).json({error:'Internal server error in sign in '})
    }
 }
 exports.verifyotp= async (req,res)=>{
    const {otp}=req.body;
    const user=req.user;
    try{
        const existingUser= await User.findOne({email:user.email});
        if (existingUser && !existingUser.verified) {
            // Check if OTP matches and has not expired
            const isOtpValid = existingUser.otp === otp && existingUser.otpExpiration > new Date();
      
            if (isOtpValid) {
              existingUser.verified = true;
              await existingUser.save();  // Save the changes to the database
      
              return res.json({ message: "Email verified. You can now log in." });
            } else {
              return res.status(400).json({ error: 'Invalid OTP or OTP has expired' });
            }
          } else {
            return res.status(500).json({ error: 'Email does not exist or is already verified' });
          }
    }
    catch(err){
        console.log(err);
        res.status(500).json( {error:'Internal server error'});
    }

 }
 exports.authenticateJWT=async(req,res,next)=>{
    const authHeader= req.headers.authorization;
    if(authHeader){
        const token=authHeader.split(' ')[1];
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err){
               return res.status(400).json({message:'Token error'});
            }
            req.user=user;
            next();

        });
    } else{
        res.status(500).send('Not a valid token user');
    }
  }