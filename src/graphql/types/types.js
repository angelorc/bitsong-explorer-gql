export default `
  type Delegations {
    delegators: [Delegator]
    total_delegator_num: Int
  }
  type Delegator {
    delegator_address: String
    validator_address: String
    shares: String
  }
`;
