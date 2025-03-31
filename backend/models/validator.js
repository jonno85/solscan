import { Schema, model } from 'mongoose';

const validatorSchema = new Schema({
  identity: { type: String, required: true, unique: true },
  commission: { type: Number, required: true },
  voteAccount: { type: String, required: true, unique: true },
  activatedStake: { type: Number, required: true },
  lastVote: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model('Validator', validatorSchema);
