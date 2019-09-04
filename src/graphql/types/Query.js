// ConnectionArgs: {after: String, first: Int, before: String, last: Int}
export default `
  type Query {
    allBlocks(pagination: PaginationInput = {}, sort: BlockSortInput = {}): BlockConnection!
    allTransactions(filters: TransactionFiltersInput = {}, pagination: PaginationInput = {}, sort: TransactionSortInput = {}): TransactionConnection!
    blocks(
      page: Int
      limit: Int
    ): [Block]
    block(height: Int): Block
    validators(
      page: Int
      limit: Int
      sort: String
      sortDirection: String
    ): [Validator]
    delegations(operatorAddress: String!): Delegations
    accounts(
      page: Int
      limit: Int
      sort: String
      sortDirection: String
    ): [Account]
    account(address: String! valoper: String): Account!
    validator(operatorAddress: String!): Validator!
  }
`;
