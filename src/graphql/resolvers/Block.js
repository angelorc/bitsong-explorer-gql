import config from "../../config";
import Block from "../../models/BlockModel";

const extractQueryParams = req => {
  // page parameter
  let page = parseInt(req.page);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // limit parameter
  let limit = parseInt(req.limit);
  if (isNaN(limit)) {
    limit = 25;
  } else if (limit > 50) {
    limit = 50;
  } else if (limit < 1) {
    limit = 1;
  }

  return {
    page,
    limit
  };
};

export default {
  Query: {
    blocks: (root, args, context) => {
      const queryParams = extractQueryParams(args);
      const query = {};

      return Block.paginate(query, {
        page: queryParams.page,
        limit: queryParams.limit,
        sort: { height: -1 }
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
