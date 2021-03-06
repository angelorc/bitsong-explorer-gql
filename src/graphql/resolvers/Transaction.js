import Transaction from "../../models/TransactionModel";
import mongoose from "mongoose";
import Message from "../../models/MessageModel";
import Account from "../../models/AccountModel";

import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
const TRANSACITON_ADDED = "TRANSACITON_ADDED";

const listenToNewTransactions = callback => {
  return Transaction.watch().on("change", async data => {
    const tx = await Transaction.findOne({
      hash: data.fullDocument.hash
    })
      .populate("signatures")
      .populate("msgs")
      .exec();

    callback(tx);
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
  Query: {
    allTransactions: async (_, args) => {
      let query = {};

      if (args.filters) {
        query = args.filters;

        if (args.filters.address) {
          const account = await Account.findOne({
            address: args.filters.address
          }).exec();

          delete args.filters.address;

          if (account) {
            query = {
              ...query,
              signatures: {
                $in: mongoose.Types.ObjectId(account._id)
              }
            };
          }
        }
      }

      const results = await Transaction.paginate(query, {
        page: args.pagination.page,
        limit: args.pagination.limit,
        sort: {
          [args.sort.field]: args.sort.direction
        },
        populate: [
          {
            path: "msgs",
            select: "-_id -tx_hash"
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
