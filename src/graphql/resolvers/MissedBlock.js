import * as bech32 from "bech32";
import { sha256 } from "js-sha256";
import config from "../../config";
import fetch from "node-fetch";
import MissedBlock from "../../models/MissedBlockModel";

const getTendermintValidators = () =>
  fetch(`${config.rpc}/validators`)
    .then(res => res.json())
    .then(res => res.result.validators);

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
  Query: {
    allMissedBlocks: async (_, args) => {
      let query = {};

      if (args.filters) {
        query = args.filters;

        if (args.filters.height) {
          query = {
            height: args.filters.height
          };
        }
      }

      const sort_by_height =
        args.sort.field === "height"
          ? {
              height: args.sort.direction
            }
          : {};

      const sort_by_moniker =
        args.sort.field === "moniker"
          ? {
              "description.moniker": args.sort.direction
            }
          : {};

      const results = await MissedBlock.paginate(query, {
        page: args.pagination.page,
        limit: args.pagination.limit,
        sort: sort_by_height,
        populate: [{ path: "validators", options: { sort: sort_by_moniker } }]
      });

      const tendermintValidators = await getTendermintValidators();

      let docs = results.docs.map(doc => {
        return {
          ...doc._doc,
          validators: doc.validators.map(validator => {
            const tendermintData = tendermintValidators.find(
              v =>
                v.address === bech32PubkeyToAddress(validator.consensus_pubkey)
            );

            return { ...validator._doc, ...tendermintData };
          })
        };
      });

      return {
        docs: docs,
        pageInfo: {
          total: results.total,
          limit: results.limit,
          page: results.page,
          pages: results.pages
        }
      };
    }
  }
};
