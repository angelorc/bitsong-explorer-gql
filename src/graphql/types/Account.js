export default `
  type Balances {
    available: String
    bonded: String
    unbonding: String
    rewards: String
    total: String
  }
  type Account {
    _id: ID!
    address: String!
    balances: Balances
  }
`;
