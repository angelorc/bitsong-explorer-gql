import { mrResolve } from "mongo-relay-connection";
import Block from "../../models/BlockModel";

export default {
  Query: {
    allBlocks: async (_, args) => {
      const query = {};

      return mrResolve(args.pagination, Block, query, args.sort);
    },
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
