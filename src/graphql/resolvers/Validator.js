import xss from "xss-filters";
import fetch from "node-fetch";
import Validator from "../../models/ValidatorModel";

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

export default {
  Query: {
    validator: (root, args, context) => {
      const operatorAddress = xss.inHTMLData(args.operatorAddress);

      return Validator.findOne({
        "details.operatorAddress": operatorAddress
      }).then(validator => {
        // return {
        //   ...validator._doc,
        //   _id: validator.id
        // };
        return validator;
      });
    },
    validators: (root, args, context) => {
      const queryParams = extractQueryParams(args);
      const query = {};

      return Validator.paginate(query, {
        page: queryParams.page,
        limit: queryParams.limit,
        sort: { [queryParams.sort]: queryParams.sortDirection }
      })
        .then(validators => {
          return validators.docs.map(validator => {
            // return {
            //   ...validator._doc,
            //   _id: validator.id
            // };
            return validator;
          });
        })
        .catch(err => {
          throw err;
        });
    },
    delegations: async (root, args, context) => {
      const operatorAddress = xss.inHTMLData(args.operatorAddress);
      const response = await fetch(
        `http://lcd.testnet-2.bitsong.network/staking/validators/${operatorAddress}/delegations`
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
