import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  tx_hash: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    index: true
  },
  value: {
    type: Object
  }
}, {
  versionKey: false
});

messageSchema.virtual("success").get(function () {
  if (this.hasOwnProperty("error")) {
    return this.error === "";
  }
});

messageSchema.plugin(mongoosePaginate);

export default mongoose.model("Message", messageSchema);
