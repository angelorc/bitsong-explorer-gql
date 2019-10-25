import fetch from "node-fetch";
import config from "../../config";

const getProposals = () =>
  fetch(`${config.stargate}/gov/proposals`)
    .then(res => res.json())
    .then(res => {
      if (res.result) return res.result;

      return res;
    });

const getProposal = proposal_id =>
  fetch(`${config.stargate}/gov/proposals/${proposal_id}`)
    .then(res => res.json())
    .then(res => {
      if (res.error) throw new Error("Unknown proposal");
      if (res.result) return res.result;

      return res;
    });

const getProposer = proposal_id =>
  fetch(`${config.stargate}/gov/proposals/${proposal_id}/proposer`)
    .then(res => res.json())
    .then(res => {
      if (res.result && res.result.proposer) return res.result.proposer;

      return res;
    });

const getVotes = proposal_id =>
  fetch(`${config.stargate}/gov/proposals/${proposal_id}/votes`)
    .then(res => res.json())
    .then(res => {
      if (res.result) return res.result;

      return res;
    });

const getDeposits = proposal_id =>
  fetch(`${config.stargate}/gov/proposals/${proposal_id}/deposits`)
    .then(res => res.json())
    .then(res => {
      if (res.result) return res.result;

      return res;
    });

const getTally = proposal_id =>
  fetch(`${config.stargate}/gov/proposals/${proposal_id}/tally`)
    .then(res => res.json())
    .then(res => {
      if (res.result) return res.result;

      return res;
    });

export default {
  ProposalContent: {
    value: _ => {
      const authorizedProposals = [
        "cosmos-sdk/ParameterChangeProposal",
        "cosmos-sdk/TextProposal"
      ];

      if (!authorizedProposals.includes(_.type)) return null;

      return {
        __typename: _.type.replace("cosmos-sdk/", "ProposalContentType"),
        ..._.value
      };
    }
  },
  Proposal: {
    proposer: async proposal => {
      return await getProposer(proposal.id);
    },
    votes: async proposal => {
      return await getVotes(proposal.id);
    },
    deposits: async proposal => {
      return await getDeposits(proposal.id);
    },
    tally: async proposal => {
      return await getTally(proposal.id);
    }
  },
  Query: {
    allProposals: async (_, args) => await getProposals(),
    proposal: async (_, args) => await getProposal(args.proposal)
  }
};
