import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
const Schema = mongoose.Schema;

/**
 * Model for a single transaction.
 *
 * @type {"mongoose".Schema}
 */
const transactionSchema = new Schema({
  height: {
    type: Number,
    required: true,
    index: true
  },
  tx_hash: {
    type: String,
    required: true,
    index: true
  },
  events: [{
    type: Object
  }],
  fee: {
    type: Object
  },
  gas_used: {
    type: Number
  },
  gas_wanted: {
    type: Number
  },
  logs: [{
    type: Object
  }],
  memo: {
    type: String
  },
  messages: [{
    type: Object
  }],
  signatures: [{
    type: Object
  }],
  timestamp: {
    type: Date,
    required: true
  }
}, {
  versionKey: false
});

transactionSchema.virtual("success").get(function () {
  if (this.hasOwnProperty("error")) {
    return this.error === "";
  }
});

transactionSchema.plugin(mongoosePaginate);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
