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
    time: Date
    num_txs: Int
    proposer: String
  }

  input BlockSortInput {
    field: BlockSortField! = height
    direction: Int! = -1
  }

  enum BlockSortField {
    height
  }
`;
