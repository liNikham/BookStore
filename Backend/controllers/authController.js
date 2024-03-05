const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt= require('bcrypt');
const User= require('../models/User');
const dotenv=require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const generateOtp=()=>{

      return Math.floor(100000 + Math.random()*9000000).toString();
}
const transporter =nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.SMTP_SECRET,
        }
      });
      const mailOptions = (otp,email)=>{
         return {
        from:process.env.EMAIL_USER,
        to:email,
        subject:'Verification Code for Bookstore',
        text:`Your Verification code is ${otp},`
      }
      }
 // Generate a reset token (random string)
function generateResetToken() {
  const length = 20; // Set the desired length of the token
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}
exports.signup= async (req,res)=>{
    try{

     const {email,password,role} = req.body;
    const existingUser = await User.findOne({email});
    
    // check kiya kya already user exist kar raha kya
    if(existingUser){
      return  res.status(400).json({error:'Email already exists'});

    }
    // otp generate kiya 
    const otp=generateOtp();
     const otpExpiration=new Date();
     otpExpiration.setMinutes(otpExpiration.getMinutes()+2);
     // ab ye jo otp create kiya wo user ko bhejna hai
     const mail=mailOptions(otp,email);
            await transporter.sendMail(mail);
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
 exports.resendOtp=async( req,res)=>{
    const otp = generateOtp();
    const user= req.user;
    const existingUser= await User.findOne({email:user.email});
    if(!existingUser){
      return res.status(401).json({error:'User not Found'})
    }
    const mail =mailOptions(otp,user.email);
    const otpExpiration=new Date();
     otpExpiration.setMinutes(otpExpiration.getMinutes()+2);
     existingUser.otp=otp;
     existingUser.otpExpiration=otpExpiration;
     await existingUser.save();
    await transporter.sendMail(mail);
    return res.status(200).json({message:'Otp sent successfully on email'});
 }
 exports.forgotPassword =async(req,res)=>{
    const {email}=req.body;
    const existingUser= User.findOne({email});
    if(!existingUser){
      return res.status(401).json({error:'User email not Found'});
    }
    const resetToken =generateResetToken();
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`; // Replace with your actual reset link

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Greeting from Nikhils Bookstore',
      html: `We received a request to reset the password for the BookStore account associated with this e-mail address. Click the link below to reset your password using our secure server:<br><br><a href="${resetLink}">${resetLink}</a>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Password reset email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
    }

 }

 exports.resetPasswordUrl = async(req,res,next)=>{
    const token = req.query.token;
    const user= req.user;
    const email=user.email;
    console.log(email);
    const existingUser= await User.findOne({email})
    if(!existingUser){
      return res.status(500).json({error:'Not a valid user'});
    }
   console.log(token);
    const isMatch = existingUser.compareToken(token);
    if(!isMatch){
      return res.status(401).json({error:'Not a valide token'});
    }
    return res.status(200).json({message:'Token verified successfully'})
 }
 exports.resetPassword=async(req,res)=>{
   const {newPassword,confirmPassword}=req.body;
   const user= req.user;
   const existingUser= await User.findOne({email:user.email});
   if(!existingUser){
    return res.status(500).json({error:'Not a valide user'});
   }
   existingUser.password=newPassword;
   await existingUser.save();
   return res.status(200).json({message:'Password reset Successfully!!!'});


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