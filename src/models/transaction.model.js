const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  fromAccount: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'account',
    required: [true,"From account is required for transaction"],
    index:true
  },
  toAccount: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'account',
    required: [true,"To account is required for transaction"],
    index:true
  },
  status: {
    type: String,
    enum:{
      values:["pending","completed","failed","reversed"],
      message:"Status must be either pending , completed or failed ,reversed",
    },
    default:"pending"
  },
  amount: {
    type: Number,
    required: [true,"Amount is required for transaction"],
    min:[0,"Amount must be greater than zero"]
  },
  idempotencyKey: {
    type: String,
    required: [true,"Idempotency key is required for transaction"],
    unique: true,
    index:true
  }
},{
  timestamps:true
})

const transactionModel = mongoose.model('transaction', transactionSchema);

module.exports = transactionModel;