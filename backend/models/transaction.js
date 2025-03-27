import { Schema, model } from 'mongoose';

const TransactionSchema = new Schema({
  signature: {
    type: String,
    required: true,
    unique: true
  },
  blockSlot: {
    type: Number,
    required: true,
    index: true
  },
  blockTime: {
    type: Number
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  },
  fee: {
    type: Number,
    required: true
  },
  accounts: [{
    type: String,
    index: true
  }],
  instructions: [{
    programId: String,
    data: String,
    accounts: [String]
  }],
  logs: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model('Transaction', TransactionSchema);