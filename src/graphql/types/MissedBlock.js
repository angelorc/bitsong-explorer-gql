export default `
  type MissedBlockConnection {
    docs: [MissedBlock]!
    pageInfo: PageInfo!
  }
  input MissedBlockSortInput {
    field: MissedBlockSortField! = height
    direction: Int! = -1
  }
  enum MissedBlockSortField {
    height
    moniker
  }
  input MissedBlockFiltersInput {
    height: Int
  }

  type MissedBlock {
    height: Int
    validators: [Validator]
    active_validators: Int
    total_validators: Int
    created_at: String
  }
`;
