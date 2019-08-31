export default `
  type PageInfo {
    total: Int
    limit: Int
    page: Int
    pages: Int
  }

  input PaginationInput {
    page: Int
    limit: Int = 25
  }
`;
