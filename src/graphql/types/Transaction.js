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
    hash: String
    height: Int
    status: Boolean
    gas_wanted: Int
    gas_used: Int
    time: Date
    memo: String
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

  input TransactionFiltersInput {
    hash: String
    height: Int
    address: String
  }
`;
