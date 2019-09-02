export default `
  type Subscription {
    transactionAdded: Transaction
  }

  type TransactionConnection {
    docs: [Transaction]!
    pageInfo: PageInfo!
  }

  type Signature {
    address: String
  }

  type MsgEditValidatorDescription {
    moniker: String
    identity: String
    website: String
    details: String
  }

  type MsgEditValidator implements MsgValue {
    Description: MsgEditValidatorDescription
    address: String
    commission_rate: String
    min_self_delegation: String
  }

  type MsgUnjail implements MsgValue {
    address: String
  }

  type MsgWithdrawDelegationReward implements MsgValue {
    delegator_address: String
    validator_address: String
  }

  type MsgWithdrawValidatorCommission implements MsgValue {
    validator_address: String
  }

  interface MsgValue {
    value: String
  }

  type Msg {
    type: String
    value: MsgValue
  }

  type Transaction {
    hash: String
    height: Int
    status: Boolean
    gas_wanted: Int
    gas_used: Int
    time: Date
    signatures: [Signature]
    msgs: [Msg]
  }

  input TransactionSortInput {
    field: TransactionSortField! = height
    direction: Int! = -1
  }

  enum TransactionSortField {
    height
  }
`;
