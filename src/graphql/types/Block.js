export default `
  type BlockConnection {
    totalCount: Int!
    edges: [BlockEdge]!
    pageInfo: PageInfo!
  }

  type BlockEdge {
    node: Block!
    cursor: Cursor!
  }

  type Block {
    height: Int
    hash: String
    time: String
    num_txs: Int
    proposer: String
  }

  input BlockSortInput {
    cursorField: BlockSortField! = height
    direction: Int! = -1
  }

  enum BlockSortField {
    height
  }
`;
