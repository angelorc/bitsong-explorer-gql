export default `
  type ValidatorConnection {
    docs: [Validator]!
    pageInfo: PageInfo!
  }
  input ValidatorSortInput {
    field: ValidatorSortField! = voting_power
    direction: Int! = -1
  }
  enum ValidatorSortField {
    voting_power
    moniker
    commission
  }
  input ValidatorFiltersInput {
    status: Int
    jailed: Boolean
  }

  type Validator {
    consensus_pubkey: String
    commission: ValidatorCommission
    delegator_address: String
    description: ValidatorDescription
    jailed: Boolean
    operator_address: String
    status: Int
    delegator_shares: Float
    min_self_delegation: String
    tokens: String
    unbonding_height: Int
    unbonding_time: String

    address: String
    pub_key: ValidatorPubKey
    voting_power: Int
    proposer_priority: String

    self_shares: Float
    delegations: [Delegation]
    unbonding_delegations: [UnbondingDelegation]
    missed_blocks: [MissedBlock]
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
    security_contact: String
  }
  type ValidatorCommissionRate {
    rate: Float
    max_rate: Float
    max_change_rate: Float
  }
  type ValidatorCommission {
    commission_rates: ValidatorCommissionRate
    update_time: String
  }
`;
