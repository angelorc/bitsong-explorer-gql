export default `
  scalar Cursor

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: Cursor
  }

  input PaginationInput {
    first: Int! = 25
    after: Cursor
  }
`
