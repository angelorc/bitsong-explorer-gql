export default `
  type Subscription {
    transactionAdded: Transaction
  }

  type TransactionConnection {
    docs: [Transaction]!
    pageInfo: PageInfo!
  }

  type Signature {
    address: String!
    pubkey: String!
    signature: String!
  }

  type MsgTransaction {
    type: String!
    value: JSONObject!
  }

  type EventAttribute {
    key: String!
    value: String!
  }

  type Event {
    type: String!
    attributes: [EventAttribute!]!
  }

  type Fee {
    amount: [Coin!]!
    gas: String!
  }

  type Transaction {
    height: Int
    tx_hash: String
    events: [Event]
    fee: Fee
    gas_used: Int
    gas_wanted: Int
    logs: [JSONObject]
    memo: String
    messages: [MsgTransaction]
    signatures: [Signature]
    timestamp: Date
  }

  input TransactionSortInput {
    field: TransactionSortField! = height
    direction: Int! = -1
  }

  enum TransactionSortField {
    height
  }

  input TransactionFiltersInput {
    tx_hash: String
    height: Int
    address: String
  }
`;
