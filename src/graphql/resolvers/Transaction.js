import Transaction from "../../models/TransactionModel";
import mongoose from "mongoose";
import Message from "../../models/MessageModel";
import Account from "../../models/AccountModel";

import {
  PubSub
} from "graphql-subscriptions";

const pubsub = new PubSub();
const TRANSACITON_ADDED = "TRANSACITON_ADDED";

const listenToNewTransactions = callback => {
  return Transaction.watch().on("change", async data => {
    if (typeof data.fullDocument !== "undefined") {
      callback(data.fullDocument)
    }
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
        // Query tx_hash
        if (args.filters.tx_hash) {
          query = {
            ...query,
            "tx_hash": args.filters.tx_hash
          }
        }

        // Query block height
        if (args.filters.height) {
          query = {
            ...query,
            "height": args.filters.height
          }
        }

        // Query for account
        if (args.filters.address) {
          query = {
            ...query,
            $or: [{
              "signatures.address": args.filters.address,
            }],
            $or: [{
              "messages.value.to_recipient": args.filters.address
            }]
          };
          /*query = {
            ...query,
            "signatures.address": args.filters.addresss
          };*/
        }
      }

      console.log(query)

      const results = await Transaction.paginate(query, {
        page: args.pagination.page,
        limit: args.pagination.limit,
        sort: {
          [args.sort.field]: args.sort.direction
        }
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
