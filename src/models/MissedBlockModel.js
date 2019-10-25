const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

/**
 * Model for a single message.
 *
 * @type {"mongoose".Schema}
 */
const missedBlockSchema = new Schema(
  {
    height: {
      type: Number,
      required: true,
      index: true
    },
    validators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Validator"
      }
    ],
    active_validators: {
      type: Number
    },
    total_validators: {
      type: Number
    },
    created_at: {
      type: String
    }
  },
  {
    versionKey: false
  }
);

missedBlockSchema.virtual("success").get(function() {
  if (this.hasOwnProperty("error")) {
    return this.error === "";
  }
});

missedBlockSchema.plugin(mongoosePaginate);

const MissedBlock = mongoose.model("MissedBlock", missedBlockSchema);

export default MissedBlock;
