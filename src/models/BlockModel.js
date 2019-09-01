import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  height: {
    type: Number,
    required: true,
    index: true
  },
  hash: {
    type: String,
    required: true,
    index: true
  },
  time: {
    type: Date,
    required: true
  },
  num_txs: {
    type: Number
  },
  proposer: {
    type: String,
    required: true
  }
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
