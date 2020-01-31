import * as bech32 from "bech32";
import { sha256 } from "js-sha256";
import config from "../../config";
import fetch from "node-fetch";
import Block from "../../models/BlockModel";
import Validator from "../../models/ValidatorModel";

const getBitSongValidators = () =>
  fetch(`${config.stargate}/staking/validators`)
    .then(res => res.json())
    .then(res => res.result);

const bech32PubkeyToAddress = consensus_pubkey => {
  // '1624DE6420' is ed25519 pubkey prefix
  let pubkeyAminoPrefix = Buffer.from("1624DE6420", "hex");
  let buffer = Buffer.from(
    bech32.fromWords(bech32.decode(consensus_pubkey).words)
  );
  let test = buffer.slice(pubkeyAminoPrefix.length).toString("base64");
  return sha256(Buffer.from(test, "base64"))
    .substring(0, 40)
    .toUpperCase();
};

export default {
  MissedBlock: {
    validators: async data => {
      const dbValidators = await Validator.find()
      const btsgValidators = await getBitSongValidators()

      const completedValidators = dbValidators.map(val => {
        const data = btsgValidators.find(v => v.operator_address === val.operator_address)
        return {
          ...val._doc,
          ...data
        }
      })

      return data.validators.map(val => {
        const data = completedValidators.find(v => v.consensus_address === val.consensus_address)
        return {
          ...val,
          ...data
        }
      })
    },
  },
  Query: {
    allMissedBlocks: async (_, args) => {
      let query = {};

      if (args.filters) {
        query = args.filters;

        if (args.filters.height) {
          query = {
            height: args.filters.height,
            'missed_validators.1': { $exists: true }
          };
        }
      }

      const result = await Block.findOne(query)

      if (!result) {
        return []
      }

      const validators = result.missed_validators.map(val => {
        return {
          consensus_address: val
        }
      })

      const resultData = {
        height: result.height,
        validators: validators
      }

      return resultData

    }
  }
};
