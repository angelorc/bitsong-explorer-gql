export default `
  type BlockConnection {
    docs: [Block]!
    pageInfo: PageInfo!
  }

  type Block {
    height: Int
    hash: String
    time: String
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
