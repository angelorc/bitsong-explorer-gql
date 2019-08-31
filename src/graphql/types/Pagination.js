export default `
  scalar Cursor

  type PageInfo {
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
    startCursor: Cursor
    endCursor: Cursor
  }

  input PaginationInput {
    first: Int
    last: Int
    after: Cursor
    before: Cursor
  }
`;
