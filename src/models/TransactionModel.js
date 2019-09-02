import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
const Schema = mongoose.Schema;

/**
 * Model for a single transaction.
 *
 * @type {"mongoose".Schema}
 */
const transactionSchema = new Schema(
  {
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
    msgs: [
      {
        type: Object
      }
    ],
    signatures: [
      {
        type: String
      }
    ],
    status: {
      type: Boolean,
      required: true
    },
    gas_wanted: {
      type: Number,
      required: true
    },
    gas_used: {
      type: Number,
      required: true
    },
    fee_amount: [],
    time: {
      type: Date,
      required: true
    }
  },
  {
    versionKey: false
  }
);

transactionSchema.virtual("success").get(function() {
  if (this.hasOwnProperty("error")) {
    return this.error === "";
  }
});

transactionSchema.plugin(mongoosePaginate);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
