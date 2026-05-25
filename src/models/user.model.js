const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

  email:{
    type:String,
    required:[true,"Please fill in your email"],
    unique:[true,"Email already exists"],
    lowercase:true,
    trim:true,
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Please fill in a valid email address"]
  },
  name:{
    type:String,
    required:[true,"Please fill in your name"],
  },
  password:{
    type:String,
    required:[true,"Please fill in your password"],
    minlength:[6,"Password must be at least 6 characters long"],
    select:false
  },
  systemUser:{
    type:Boolean,
    default:false,
    immutable:true,
    select:false
  }
},{timestamps:true});

userSchema.pre('save',async function(next){
  if(!this.isModified('password')){
    return ;
  }
  const hash=await bcrypt.hash(this.password,10);
  this.password=hash;
  return ;
});

userSchema.methods.comparePassword=async function(password){
  return await bcrypt.compare(password,this.password);
};

const userModel=mongoose.model('user',userSchema);

module.exports=userModel;