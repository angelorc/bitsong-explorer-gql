export default `
  type Denom {
    name: String
  }

  type Custodian {
    address: String
    suffix: String
    name: String
    full_address: String
    website: String
    denoms: [Denom]
  }
`;
