const userModel=require('../models/user.model');
const jwt=require('jsonwebtoken');

async function userRegisterController(req,res){
  const {name,email,password}=req.body;
  const isExists=await userModel.findOne({email});
  if(isExists){
    return res.status(400).json({message:'User already exists with this email'});
  }
  const user=await userModel.create({name,email,password});

  const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'2d'});

  res.cookie("token",token);

  res.status(201).json({
    message:'User registered successfully',
    user:{
      _id:user._id,
      name:user.name,
      email:user.email
    },
    token
  });
}

async function userLoginController(req,res){
  const {email,password}=req.body;
  const user=await userModel.findOne({email}).select("password");;
  if(!user){
    return res.status(400).json({message:'Invalid email or password'});
  }
  const isMatch=await user.comparePassword(password);
  if(!isMatch){
    return res.status(400).json({message:'Invalid email or password'});
  }
  const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'2d'});

  res.cookie("token",token);
  res.status(200).json({
    message:'User logged in successfully',
    user:{
      _id:user._id,
      name:user.name,
      email:user.email
    },
    token
  });
}

module.exports={
    userRegisterController,
    userLoginController
}