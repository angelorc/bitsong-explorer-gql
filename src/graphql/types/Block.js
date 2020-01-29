export default `
  scalar Date

  type Subscription {
    blockAdded: Block
  }

  type BlockConnection {
    docs: [Block]!
    pageInfo: PageInfo!
  }

  type Block {
    height: Int
    hash: String
    num_txs: Int
    precommits: Int
    proposer_address: String
    total_gas: Int
    missed_validators: [String]
    timestamp: Date
  }

  input BlockSortInput {
    field: BlockSortField! = height
    direction: Int! = -1
  }

  enum BlockSortField {
    height
  }
`;
