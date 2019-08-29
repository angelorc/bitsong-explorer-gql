export default `
  type Delegation {
    delegator_address: String
    validator_address: String
    shares: Float
  }
  type ValidatorPubKey {
    type: String
    value: String
  }
  type ValidatorDescription {
    moniker: String
    identity: String
    website: String
    details: String
    avatar: String
  }
  type ValidatorCommissionRate {
    rate: Float
    max_rate: Float
    max_change_rate: Float
  }
  type ValidatorCommission {
    commission: ValidatorCommissionRate
    update_time: String
  }
  type ValidatorDetails {
    operator_address: String
    consensus_pubkey: String
    delegator_address: String
    jailed: Boolean
    status: Int
    tokens: String
    delegator_shares: Float
    self_shares: Float
    description: ValidatorDescription
    unbonding_height: Int
    unbonding_time: String
    commission: ValidatorCommission
    min_self_delegation: Int
  }
  type Validator {
    address: String
    pub_key: ValidatorPubKey
    voting_power: Int
    proposer_priority: String
    details: ValidatorDetails
    delegations: [Delegation]
  }
`;
