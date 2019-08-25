const {
  buildSchema
} = require('graphql');
const {
  gql
} = require('apollo-server');

module.exports = gql `
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
  voting_power: Int!
  proposer_priority: Int!
  details: ValidatorDetails
}
type Query {
  validators: [Validator!]!
},
`;