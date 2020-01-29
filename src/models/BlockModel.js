import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  hash: {
    type: String,
    required: true,
    index: true
  },
  height: {
    type: Number,
    required: true,
    index: true
  },
  num_txs: {
    type: Number,
    required: true
  },
  precommits: {
    type: Number,
    required: true
  },
  proposer_address: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  total_gas: {
    type: Number,
    required: true
  },
  missed_validators: {
    type: Array
  },
}, {
  versionKey: false
});

blockSchema.virtual("success").get(function () {
  if (this.hasOwnProperty("error")) {
    return this.error === "";
  }
});

blockSchema.plugin(mongoosePaginate);

const Block = mongoose.model("Block", blockSchema);

export default Block;
