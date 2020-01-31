// ConnectionArgs: {after: String, first: Int, before: String, last: Int}
export default `
  type Query {
    allBlocks(pagination: PaginationInput = {}, sort: BlockSortInput = {}): BlockConnection!
    block(height: Int): Block
    allTransactions(filters: TransactionFiltersInput = {}, pagination: PaginationInput = {}, sort: TransactionSortInput = {}): TransactionConnection!
    account(address: String! valoper: String): Account!

    allMissedBlocks(filters: MissedBlockFiltersInput = {}): MissedBlock
    allValidators(filters: ValidatorFiltersInput = {}, pagination: PaginationInput = {}, sort: ValidatorSortInput = {}): ValidatorConnection!
    validator(operatorAddress: String!): Validator!

    accounts(
      page: Int
      limit: Int
      sort: String
      sortDirection: String
    ): [Account]



    allProposals: [Proposal]
    proposal(proposal: Int!): Proposal
    chartValidators(limit: Int = 12): [ChartValidators]
    blocks(
      page: Int
      limit: Int
    ): [Block]
    delegations(operatorAddress: String!): Delegations
  }
`;
