import { Schema, model } from 'mongoose';

const AccountSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  lamports: {
    type: Number,
    required: true
  },
  owner: {
    type: String
  },
  executable: {
    type: Boolean,
    default: false
  },
  rentEpoch: {
    type: Number
  },
  data: {
    type: String
  },
  tokenAccounts: [{
    mint: String,
    amount: String,
    decimals: Number
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default model('Account', AccountSchema);