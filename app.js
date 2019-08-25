const express = require('express');
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose')
const {
  ApolloServer,
  gql
} = require('apollo-server');

const graphQLSchema = require('./graphql/schema/index')
const graphQLResolvers = require('./graphql/resolvers/index')

const Validator = require('./models/ValidatorModel')

const typeDefs = gql `
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
  validators: [Validator!]!
}
`;

const resolvers = {
  Query: {
    validators: () => {
      return Validator.find()
        .then(validators => {
          return validators.map(validator => {
            return {
              ...validator._doc,
              _id: validator.id
            }
          })
        }).catch(err => {
          throw err
        })
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
});

mongoose.connect("mongodb://localhost:27017/bitsong").then(() => {
  server.listen().then(({
    url
  }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}).catch(err => {
  console.log(err)
})