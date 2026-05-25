const transacrionModel=require('../models/transaction.model');
const ledgerModel=require('../models/ledger.model');
const emailService=require('../services/email.service');
const accountModel=require('../models/account.model');
const mongoose=require('mongoose');

async function createTransaction(req, res) {

  const { fromAccount, toAccount, amount,idempotencyKey } = req.body;
  
}

async function createInitialFundsTransaction(req,res) {
  const { toAccount, amount,idempotencyKey } = req.body;

  if(!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({message:"To account , amount and idempotency key are required"});
  }

  const toUserAccount=await accountModel.findOne({_id:toAccount});

  if(!toUserAccount){
    return res.status(404).json({message:"To account not found"});
  }

  const fromUserAccount=await accountModel.findOne({
    
    user:req.user._id
  });

  if(!fromUserAccount){
    return res.status(404).json({message:"System account for user not found"});
  }

  const session=await mongoose.startSession();
  session.startTransaction();

  const transaction=new transacrionModel({
    fromAccount:fromUserAccount._id,
    toAccount:toUserAccount._id,
    amount,
    idempotencyKey,
    status:"pending"
  });

  const debitLedgerEntry=await ledgerModel.create([{
    account:fromUserAccount._id,
    transaction:transaction._id,
    type:"debit",
    amount
  }],{session});

  const creditLedgerEntry=await ledgerModel.create([{
    account:toUserAccount._id,
    transaction:transaction._id,
    type:"credit",
    amount
  }],{session});

  transaction.status="completed";
  await transaction.save({session});

  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({message:"Initial funds transaction created successfully",transaction});

}

module.exports={
    createTransaction,
    createInitialFundsTransaction

}