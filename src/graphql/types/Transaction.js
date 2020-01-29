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

  type Transaction {
    height: Int
    tx_hash: String
    events: [JSONObject]
    fee: JSONObject
    gas_used: Int
    gas_wanted: Int
    logs: [JSONObject]
    memo: String
    messages: [JSONObject]
    signatures: [JSONObject]
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
    hash: String
    height: Int
    address: String
  }
`;
