export default `
  type Query {
    allBlocks(pagination: PaginationInput = {}, sort: BlockSortInput = {}): BlockConnection!
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
    account(address: String!): Account!
    validator(operatorAddress: String!): Validator!
  }
`
