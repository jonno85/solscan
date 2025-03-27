import { Schema, model } from 'mongoose';

const TokenSchema = new Schema({
  mint: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  },
  symbol: {
    type: String
  },
  iconUrl: {
    type: String
  },
  decimals: {
    type: Number
  },
  supply: {
    type: String
  },
  holders: {
    type: Number,
    default: 0
  },
  price: {
    usd: Number,
    lastUpdated: Date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default model('Token', TokenSchema);