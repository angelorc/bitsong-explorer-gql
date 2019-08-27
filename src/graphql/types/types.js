export default `
type Account {
    _id: ID!
    address: String!
  }
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
