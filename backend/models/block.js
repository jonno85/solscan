import { Schema, model } from 'mongoose';

const BlockSchema = new Schema({
  slot: {
    type: Number,
    required: true,
    unique: true
  },
  blockhash: {
    type: String,
    required: true,
    unique: true
  },
  parentSlot: {
    type: Number,
    required: true
  },
  blockTime: {
    type: Number,
    required: true
  },
  blockHeight: {
    type: Number
  },
  transactions: [{
    type: Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  transactionCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model('Block', BlockSchema);