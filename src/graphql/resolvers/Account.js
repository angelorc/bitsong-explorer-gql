import xss from "xss-filters";
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
    account: (root, args, context) => {
      const address = xss.inHTMLData(args.address);

      return Account.findOne({
        address: address
      }).then(account => {
        // return {
        //   ...account._doc,
        //   _id: account.id
        // };
        return account;
      });
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
