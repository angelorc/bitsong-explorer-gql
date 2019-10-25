import MissedBlock from "../../models/MissedBlockModel";

export default {
  ChartValidators: {
    active: record => {
      return record.active_validators
    },
    inactive: record => {
      return record.total_validators - record.active_validators
    },
    total: record => {
      return record.total_validators
    }
  },
  Query: {
    chartValidators: async (_, args) => {
      try {
        const find = {};
        const sort = {
          height: -1
        };
        const limit = args.limit;

        return await MissedBlock.find(find).sort(sort).limit(limit)
      } catch (err) {
        throw err;
      }
    }
  }
};
