const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

/**
 * Model for a single validator.
 *
 * @type {"mongoose".Schema}
 */
const validatorSchema = new Schema(
  {
    address: {
      type: String,
      index: true
    },
    consensus_address: {
      type: String,
      index: true
    },
    consensus_pubkey: {
      type: String,
      required: true,
      index: true
    },
    operator_address: {
      type: String,
      required: true,
      index: true
    },
    delegator_address: {
      type: String,
      index: true
    }
  },
  {
    versionKey: false
  }
);

// indices
validatorSchema.index({ address: 1 }, { name: "validatorAddressIndex" });

validatorSchema.plugin(mongoosePaginate);

const Validator = mongoose.model("Validator", validatorSchema);
export default Validator;
