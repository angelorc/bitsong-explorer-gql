import {
  Pagination,
  paginationResolvers
} from "@limit0/mongoose-graphql-pagination";
import {
  CursorType
} from "@limit0/graphql-custom-types";
import Block from "../../models/BlockModel";

export default {
  Cursor: CursorType,
  BlockConnection: paginationResolvers.connection,
  Query: {
    allBlocks: (root, {
      pagination,
      sort
    }) => new Pagination(Block, {
      pagination,
      sort
    }, {
      sort: {
        field: 'height'
      },
    }),
    block: (root, args, context) => {
      const height = parseInt(args.height);

      return Block.findOne({
        height: height
      });
    },
    blocks: (root, args, context) => {
      const queryParams = extractQueryParams(args);
      const query = {};

      return Block.paginate(query, {
          page: queryParams.page,
          limit: queryParams.limit,
          sort: {
            height: -1
          }
        })
        .then(blocks => {
          return blocks.docs.map(block => {
            return block;
          });
        })
        .catch(err => {
          throw err;
        });
    }
  }
};
