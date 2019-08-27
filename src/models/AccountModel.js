import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    versionKey: false
  }
);

accountSchema.virtual("success").get(function() {
  if (this.hasOwnProperty("error")) {
    return this.error === "";
  }
});

accountSchema.plugin(mongoosePaginate);

const Account = mongoose.model("Account", accountSchema);

export default Account;
