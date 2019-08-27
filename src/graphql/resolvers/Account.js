import xss from "xss-filters";
import config from "../../config"
import fetch from "node-fetch";
import Account from "../../models/AccountModel";

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
    account: async (root, args) => {
      const address = xss.inHTMLData(args.address);

      if (!address) {
        throw Error("Invalid address")
      }

      try {
        const available = await fetch(`${config.stargate}/bank/balances/${address}`).then(res => res.json()).then(response => {
          if (response.error) {
            throw response.error
          }

          if (response.result.length === 0) {
            return 0
          }

          return response.result[0].amount
        })

        const bonded = await fetch(`${config.stargate}/staking/delegators/${address}/delegations`).then(res => res.json()).then(response => {
          if (response.error) {
            throw response.error
          }

          if (response.result.length === 0) {
            return 0
          }

          let bondedBalance = 0

          for (const balance of response.result) {
            bondedBalance += parseFloat(balance.shares)
          }

          return bondedBalance
        })

        const unbonding = await fetch(`${config.stargate}/staking/delegators/${address}/unbonding_delegations`).then(res => res.json()).then(response => {
          if (response.error) {
            throw response.error
          }

          if (response.result.length === 0) {
            return 0
          }

          let unbondingBalance = 0

          // for (const balance of response.result) {
          //   bondedBalance += parseFloat(balance.shares)
          // }

          return unbondingBalance
        })

        const rewards = await fetch(`${config.stargate}/distribution/delegators/${address}/rewards`).then(res => res.json()).then(response => {
          if (response.error) {
            throw response.error
          }

          if (response.result.rewards === null) {
            return 0
          }

          if (response.result.rewards[0].reward.length === 0) {
            return 0
          }

          return response.result.rewards[0].reward[0].amount
        })

        const total = parseFloat(available) + parseFloat(bonded) + parseFloat(unbonding) + parseFloat(rewards)

        return {
          address: address,
          balances: {
            available: available,
            bonded: bonded,
            unbonding: unbonding,
            rewards: rewards,
            total: total
          }
        }
      } catch (error) {
        throw error
      }
    },
    accounts: (root, args, context) => {
      const queryParams = extractQueryParams(args);
      const query = {};

      return Account.paginate(query, {
          page: queryParams.page,
          limit: queryParams.limit
        })
        .then(accounts => {
          return accounts.docs.map(account => {
            // return {
            //   ...account._doc,
            //   _id: account.id
            // };
            return account;
          });
        })
        .catch(err => {
          throw err;
        });
    }
  }
};
