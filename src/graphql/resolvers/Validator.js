import * as bech32 from "bech32";
import config from "../../config";
import fetch from "node-fetch";
import {
  sha256
} from "js-sha256";

const pubkeyToBech32 = (pubkey, prefix) => {
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

const operatorAddrToAccoutAddr = (operatorAddr, prefix) => {
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

const getValidators = () => fetch(`${config.stargate}/staking/validators`)
  .then(res => res.json())
  .then(res => {
    if (res.result) return res.result
    return res
  });

const getValidator = (validatorAddr) => fetch(`${config.stargate}/staking/validators/${validatorAddr}`)
  .then(res => res.json())
  .then(res => {
    if (res.result) return res.result

    return res
  });

const getDelegations = (validatorAddr) => fetch(`${config.stargate}/staking/validators/${validatorAddr}/delegations`)
  .then(res => res.json())
  .then(res => {
    if (res.result) return res.result

    return res
  });

const getUnbondingDelegations = (validatorAddr) => fetch(`${config.stargate}/staking/validators/${validatorAddr}/unbonding_delegations`)
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
      return operatorAddrToAccoutAddr(validator.operator_address, config.prefix.bech32PrefixAccAddr)
    },
    self_shares: async (validator) => {
      const delegator_address = operatorAddrToAccoutAddr(validator.operator_address, config.prefix.bech32PrefixAccAddr)
      const delegations = await getDelegations(validator.operator_address)

      return delegations.find(v => v.delegator_address === delegator_address).shares
    }
  },
  Validator: {
    delegations: async (validator) => {
      return await getDelegations(validator.details.operator_address)
    },
    unbonding_delegations: async (validator) => {
      return await getUnbondingDelegations(validator.details.operator_address)
    }
  },
  Query: {
    validator: async (root, args, context) => {
      try {
        const tendermintValidators = await getTendermintValidators();
        const validatorDetails = await getValidator(args.operatorAddress)
        const tendermintData = tendermintValidators.find(v => v.address === bech32PubkeyToAddress(validatorDetails.consensus_pubkey))

        return {
          ...tendermintData,
          details: validatorDetails
        }
      } catch (err) {
        throw err
      }
    },
    validators: async (root, args, context) => {
      try {
        const tendermintValidators = await getTendermintValidators();
        const stargateValidators = await getValidators();

        return tendermintValidators.map((tmVal) => {
          const validatorDetails = stargateValidators.find(v => v.consensus_pubkey === pubkeyToBech32(tmVal.pub_key, config.prefix.bech32PrefixConsPub))

          return {
            ...tmVal,
            details: validatorDetails
          }
        })
      } catch (err) {
        throw err
      }
    }
  }
};
