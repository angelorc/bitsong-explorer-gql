const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server");
const xss = require("xss-filters");
const fetch = require("node-fetch");

const graphQLSchema = require("./graphql/schema/index");
const graphQLResolvers = require("./graphql/resolvers/index");

const Validator = require("./models/ValidatorModel");
const Account = require("./models/AccountModel");

const typeDefs = gql`
  type Delegations {
    delegators: [Delegator]
    total_delegator_num: Int
  }
  type Delegator {
    delegator_address: String
    validator_address: String
    shares: String
  }
  type ValidatorCommission {
    rate: String!
    maxRate: String!
    maxChangeRate: String!
    updateTime: String!
  }
  type ValidatorDescription {
    moniker: String!
    identity: String
    website: String
    profile_url: String
    details: String
  }
  type ValidatorDetails {
    operatorAddress: String!
    delegatorAddress: String!
    consensusPubKey: String!
    jailed: Boolean!
    status: String!
    tokens: String!
    delegatorShares: String!
    description: ValidatorDescription
    commission: ValidatorCommission
  }
  type Validator {
    _id: ID!
    address: String!
    voting_power: String!
    proposer_priority: String!
    details: ValidatorDetails
  }
  type Account {
    _id: ID!
    address: String!
  }
  type Query {
    validators(
      page: Int
      limit: Int
      sort: String
      sortDirection: String
    ): [Validator]
    delegations(operatorAddress: String!): Delegations
    accounts(
      page: Int
      limit: Int
      sort: String
      sortDirection: String
    ): [Account]
    account(address: String!): Account!
    validator(operatorAddress: String!): Validator!
  }
`;

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

const resolvers = {
  Query: {
    account: (root, args, context) => {
      const address = xss.inHTMLData(args.address);

      return Account.findOne({
        address: address
      }).then(account => {
        return {
          ...account._doc,
          _id: account.id
        };
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
            return {
              ...account._doc,
              _id: account.id
            };
          });
        })
        .catch(err => {
          throw err;
        });
    },
    validator: (root, args, context) => {
      const operatorAddress = xss.inHTMLData(args.operatorAddress);

      return Validator.findOne({
        "details.operatorAddress": operatorAddress
      }).then(validator => {
        return {
          ...validator._doc,
          _id: validator.id
        };
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
            return {
              ...validator._doc,
              _id: validator.id
            };
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

const server = new ApolloServer({
  typeDefs,
  resolvers
});

mongoose
  .connect("mongodb://localhost:27017/bitsong")
  .then(() => {
    server.listen().then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
