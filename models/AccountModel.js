const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
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

module.exports = mongoose.model("Account", accountSchema);
