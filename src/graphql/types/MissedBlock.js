export default `
  input MissedBlockFiltersInput {
    height: Int
  }
  type MissedBlock {
    height: Int!
    validators: [Validator]
  }
`;
