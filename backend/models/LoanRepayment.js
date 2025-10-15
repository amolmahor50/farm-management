import mongoose from 'mongoose';

const loanRepaymentSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Loan',
  },
  amount: {
    type: Number,
    required: [true, 'Please add payment amount'],
    min: 0,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

loanRepaymentSchema.index({ loanId: 1, paymentDate: -1 });

const LoanRepayment = mongoose.model('LoanRepayment', loanRepaymentSchema);

export default LoanRepayment;
