const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server");
const xss = require("xss-filters");

const graphQLSchema = require("./graphql/schema/index");
const graphQLResolvers = require("./graphql/resolvers/index");

const Validator = require("./models/ValidatorModel");

const typeDefs = gql`
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
    operatorAddress: String
    consensusPubkey: String
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
  type Query {
    validators(
      page: Int
      limit: Int
      sort: String
      sortDirection: String
    ): [Validator]
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
