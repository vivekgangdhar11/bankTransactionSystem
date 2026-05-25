const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  account: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: [true,"Account is required for ledger entry"],
    index:true,
    immutable:true
  },
  amount: {
    type: Number,
    required: [true,"Amount is required for ledger entry"],
    immutable:true
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'transaction',
    required: [true,"Transaction is required for ledger entry"],
    index:true,
    immutable:true
  },
  type: {
    type: String,
    enum:{
      values:["debit","credit"],
      message:"Type must be either debit or credit",
    },
    required: [true,"Type is required for ledger entry"],
    immutable:true
  }
},{
  timestamps:true
})

function preventQueryModification() {
  throw new Error("Ledger entries cannot be modified or deleted");
}

// Prevent any query-based updates or deletes on ledger entries
ledgerSchema.pre("findOneAndUpdate", preventQueryModification);
ledgerSchema.pre("updateOne", preventQueryModification);
ledgerSchema.pre("deleteOne", preventQueryModification);
ledgerSchema.pre("deleteMany", preventQueryModification);
ledgerSchema.pre("remove", preventQueryModification);
ledgerSchema.pre("updateMany", preventQueryModification);
ledgerSchema.pre("findOneAndDelete", preventQueryModification);
ledgerSchema.pre("findOneAndRemove", preventQueryModification);
ledgerSchema.pre("findOneAndReplace", preventQueryModification);

// Allow creating new ledger entries (`save` when `isNew === true`) but block
// attempts to save (modify) an existing document.
ledgerSchema.pre('save', function (next) {
  if (!this.isNew) {
    const err = new Error('Ledger entries cannot be modified or deleted');
    if (typeof next === 'function') return next(err);
    throw err;
  }
  if (typeof next === 'function') return next();
});

const ledgerModel = mongoose.model('ledger', ledgerSchema);

module.exports = ledgerModel;