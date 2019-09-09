import config from "../../config";
import fetch from "node-fetch";

const getCustodians = () =>
  fetch(`${config.stargate}/custodian/custodians`)
    .then(res => res.json())
    .then(res => {
      if (res.error) throw res.error;

      return res.result.custodians;
    });

const getCustodian = custodianAddr =>
  fetch(`${config.stargate}/custodian/custodian/${custodianAddr}`)
    .then(res => res.json())
    .then(res => {
      if (res.error) throw res.error;

      return res.result;
    });
export default {
  Query: {
    custodian: async (_, args) => {
      const address = args.address;
      const custodian = await getCustodian(address);

      return custodian;
    },
    allCustodians: async (_, args) => {
      const custodians = await getCustodians();

      return custodians;
    }
  }
};
