// replica01:PRIMARY> db.messages.distinct("type");
// [
// 	"cosmos-sdk/MsgBeginRedelegate",
// 	"cosmos-sdk/MsgCreateValidator",
// 	"cosmos-sdk/MsgUndelegate",
// 	"cosmos-sdk/MsgWithdrawDelegationReward",
// 	*****"cosmos-sdk/MsgDelegate",
// 	*****"cosmos-sdk/MsgEditValidator",
// 	*****"cosmos-sdk/MsgUnjail",
// 	*****"cosmos-sdk/MsgWithdrawValidatorCommission"
// ]

// type MsgWithdrawDelegationReward implements MsgValue {
//   delegator_address: String
//   validator_address: String
// }

export default `
  type Amount {
    denom: String
    amount: String
  }

  type MsgWithdrawValidatorCommission {
    validator_address: String
  }

  type MsgDelegate {
    delegator_address: String
    validator_address: String
    amount: Amount
  }

  type MsgUnjail {
    address: String
  }

  type MsgEditValidatorDescription {
    moniker: String
    identity: String
    website: String
    details: String
  }

  type MsgEditValidator {
    Description: MsgEditValidatorDescription
    address: String
    commission_rate: String
    min_self_delegation: String
  }

  union MsgValue = MsgEditValidator | MsgDelegate | MsgUnjail | MsgWithdrawValidatorCommission

  type Msg {
    type: String
    value: MsgValue
  }

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
