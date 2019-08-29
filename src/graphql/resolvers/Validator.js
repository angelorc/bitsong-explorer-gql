import xss from "xss-filters";
import * as bech32 from "bech32";
import config from "../../config";
import fetch from "node-fetch";
import {
  sha256
} from "js-sha256";
import Validator from "../../models/ValidatorModel";
import {
  ReplaceFieldWithFragment
} from "@kamilkisiela/graphql-tools";

const extractQueryParams = req => {
  // page parameter
  let page = parseInt(xss.inHTMLData(req.page));
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // limit parameter
  let limit = parseInt(xss.inHTMLData(req.limit));
  if (isNaN(limit)) {
    limit = 25;
  } else if (limit > 50) {
    limit = 50;
  } else if (limit < 1) {
    limit = 1;
  }

  // sort parameter
  let sort = xss.inHTMLData(req.sort);
  let sortDirection = xss.inHTMLData(req.sortDirection);

  switch (sort) {
    case "moniker":
      sort = "details.description.moniker";
      break;
    case "address":
      sort = "address";
      break;
    case "voting_power":
      sort = "voting_power";
      break;
    default:
      sort = "address";
  }

  switch (sortDirection) {
    case "asc":
      sortDirection = 1;
      break;
    default:
      sortDirection = -1;
  }

  return {
    page,
    limit,
    sort,
    sortDirection
  };
};

const pubkeyToBech32 = (pubkey, prefix = "bitsongpub") => {
  // '1624DE6420' is ed25519 pubkey prefix
  let pubkeyAminoPrefix = Buffer.from("1624DE6420", "hex");
  let buffer = Buffer.alloc(37);
  pubkeyAminoPrefix.copy(buffer, 0);
  Buffer.from(pubkey.value, "base64").copy(buffer, pubkeyAminoPrefix.length);
  return bech32.encode(prefix, bech32.toWords(buffer));
}

const bech32PubkeyToAddress = (consensus_pubkey) => {
  // '1624DE6420' is ed25519 pubkey prefix
  let pubkeyAminoPrefix = Buffer.from("1624DE6420", "hex");
  let buffer = Buffer.from(bech32.fromWords(bech32.decode(consensus_pubkey).words));
  let test = buffer.slice(pubkeyAminoPrefix.length).toString("base64");
  return sha256(Buffer.from(test, "base64"))
    .substring(0, 40)
    .toUpperCase();
}

const operatorAddrToAccoutAddr = (operatorAddr, prefix = "bitsong") => {
  const address = bech32.decode(operatorAddr);
  return bech32.encode(prefix, address.words);
}

const getValidatorProfileUrl = identity => {
  if (identity.length == 16) {
    return fetch(`https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`)
      .then(res => res.json())
      .then(response => {
        let them = response.them;
        return (
          them &&
          them.length &&
          them[0].pictures &&
          them[0].pictures.primary &&
          them[0].pictures.primary.url
        );
      })
  }

  return null;
}

const getTendermintValidators = () => fetch(`${config.rpc}/validators`)
  .then(res => res.json())
  .then(res => res.result.validators);

const getStargateValidators = () => fetch(`${config.stargate}/staking/validators`)
  .then(res => res.json())
  .then(res => res.result);

const getStargateValidator = (validatorAddr) => fetch(`${config.stargate}/staking/validators/${validatorAddr}`)
  .then(res => res.json())
  .then(res => {
    if (res.error) throw res.error

    return res.result
  });

const getStargateDelegations = (validatorAddr) => fetch(`${config.stargate}/staking/validators/${validatorAddr}/delegations`)
  .then(res => res.json())
  .then(res => {
    if (res.error) throw res.error

    return res.result
  });

export default {
  ValidatorDescription: {
    avatar: (validatorDescription) => {
      const identity = validatorDescription.identity

      if (identity)
        return getValidatorProfileUrl(validatorDescription.identity)

      return null
    }
  },
  ValidatorDetails: {
    delegator_address: (validator) => {
      return operatorAddrToAccoutAddr(validator.operator_address)
    },
    self_shares: async (validator) => {
      const delegator_address = operatorAddrToAccoutAddr(validator.operator_address)
      const delegations = await getStargateDelegations(validator.operator_address)

      return delegations.find(v => v.delegator_address === delegator_address).shares
    }
  },
  Validator: {
    delegations: async (validator) => {
      return await getStargateDelegations(validator.details.operator_address)
    }
  },
  Query: {
    validator: async (root, args, context) => {
      try {
        const tendermintValidators = await getTendermintValidators();
        const validator = await getStargateValidator(args.operatorAddress)
        const tendermintData = tendermintValidators.find(v => v.address === bech32PubkeyToAddress(validator.consensus_pubkey))

        return {
          ...tendermintData,
          details: validator
        }
      } catch (err) {
        throw err
      }
    },
    validators: async (root, args, context) => {
      try {
        const tendermintValidators = await getTendermintValidators();
        const stargateValidators = await getStargateValidators();

        return tendermintValidators.map((tmVal) => {
          const validatorDetails = stargateValidators.find(v => v.consensus_pubkey === pubkeyToBech32(tmVal.pub_key, "bitsongvalconspub"))

          return {
            ...tmVal,
            details: validatorDetails
          }
        })
      } catch (err) {
        throw err
      }
    },
    delegations: async (root, args, context) => {
      const operatorAddress = xss.inHTMLData(args.operatorAddress);
      const response = await fetch(
        `${config.stargate}/staking/validators/${operatorAddress}/delegations`
      ).then(res => res.json());

      if (response.result) {
        return {
          total_delegator_num: response.result.length,
          delegators: response.result.map(delegator => {
            return {
              delegator_address: delegator.delegator_address,
              validator_address: delegator.validator_address,
              shares: delegator.shares
            };
          })
        };
      }

      return {
        total_delegator_num: 0,
        delegators: []
      };
    }
  }
};
