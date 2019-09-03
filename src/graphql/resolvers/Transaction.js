import Transaction from "../../models/TransactionModel";
import Message from "../../models/MessageModel";
import {
  PubSub
} from "graphql-subscriptions";

const pubsub = new PubSub();
const TRANSACITON_ADDED = "TRANSACITON_ADDED";

const listenToNewTransactions = callback => {
  return Transaction.watch().on("change", data => {
    callback(data.fullDocument);
  });
};

listenToNewTransactions(transaction => {
  pubsub.publish(TRANSACITON_ADDED, {
    transactionAdded: transaction
  });
});

export default {
  Subscription: {
    transactionAdded: {
      subscribe: () => pubsub.asyncIterator([TRANSACITON_ADDED])
    }
  },
  Msg: {
    value: (_) => {
      return {
        __typename: _.type.replace('cosmos-sdk/', ''),
        ..._.value
      }
    }
  },
  Transaction: {
    msgs: (_) => _.msgs.map(msg => msg._doc)
  },
  Query: {
    allTransactions: async (_, args) => {
      const query = {};
      const results = await Transaction.paginate(query, {
        page: args.pagination.page,
        limit: args.pagination.limit,
        sort: {
          [args.sort.field]: args.sort.direction
        },
        populate: [{
            path: "msgs",
            select: "-_id -tx_hash"
          },
          {
            path: "signatures"
          }
        ]
      });

      debugger;

      return {
        docs: results.docs,
        pageInfo: {
          total: results.total,
          limit: results.limit,
          page: results.page,
          pages: results.pages
        }
      };
    }
  }
};
