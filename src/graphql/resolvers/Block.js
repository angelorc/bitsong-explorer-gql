import Block from "../../models/BlockModel";
import {
  PubSub
} from 'graphql-subscriptions';
import asyncify from 'callback-to-async-iterator';

const listenToNewBlocks = (callback) => {
  return Block.watch().on('change', data => {
    callback(data.fullDocument)
  });
}

listenToNewBlocks(block => {
  pubsub.publish(BLOCK_ADDED, {
    blockAdded: block
  });
})

const pubsub = new PubSub();

const BLOCK_ADDED = 'BLOCK_ADDED';

export default {
  Subscription: {
    blockAdded: {
      subscribe: () => pubsub.asyncIterator([BLOCK_ADDED]),
    },
  },
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
