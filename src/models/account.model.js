const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true,"Account must be associate to user"],
    index:true
  },
  status: {
    type: String,
    enum:{
      values:["active","frozen","closed"],
      message:"Status must be either active , closed or frozen",
      
    },
    default:"active"
  },
  currency: {
    type: String,
    required: [true,"Currency is required for account"],
    default:"INR"
  }
    
},{
  timestamps:true
})

const accountModel = mongoose.model('account', accountSchema);

accountSchema.index({ user: 1 , status: 1 }); // Ensure one account per user

module.exports = accountModel;