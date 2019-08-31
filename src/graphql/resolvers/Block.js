import Block from "../../models/BlockModel";

export default {
  Query: {
    allBlocks: async (_, args) => {
      const query = {};
      const results = await Block.paginate(query, {
        page: args.pagination.page,
        limit: args.pagination.limit,
        sort: {
          [args.sort.field]: args.sort.direction
        }
      });

      return {
        docs: results.docs,
        pageInfo: {
          total: results.total,
          limit: results.limit,
          page: results.page,
          pages: results.pages
        }
      };
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
