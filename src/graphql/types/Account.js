export default `
  type Balances {
    available: String
    bonded: String
    unbonding: String
    rewards: String
    commissions: String
  }
  type UnbondingDelegationEntry {
    creation_height: String
    completion_time: String
    initial_balance: String
    balance: String
  }
  type UnbondingDelegation {
    delegator_address: String
    validator_address: String
    entries: [UnbondingDelegationEntry]
  }
  type Delegation {
    delegator_address: String
    validator_address: String
    shares: Float
  }
  type RedelegationEntry {
    creation_height: Int
    completion_time: String
    initial_balance: String
    shares_dst: String
    balance: String
  }
  type Redelegation {
    delegator_address: String
    validator_src_address: String
    validator_dst_address: String
    entries: [RedelegationEntry]
  }
  type Account {
    address: String
    balances: Balances
    delegations: [Delegation]
    unbonding_delegations: [UnbondingDelegation]
    redelegations: [Redelegation]
  }
`;
