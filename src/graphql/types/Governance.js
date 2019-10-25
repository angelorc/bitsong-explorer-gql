export default `
  type Proposal {
    proposer: String
    content: ProposalContent
    id: Int
    proposal_status: String
    final_tally_result: ProposalTallyResult
    submit_time: String
    deposit_end_time: String
    total_deposit: [Coin]
    voting_start_time: String
    voting_end_time: String
    votes: [ProposalVote]
    deposits: [ProposalDeposit]
    tally: ProposalTallyResult
  }

  type ProposalDeposit {
    depositor: String
    amount: [Coin]
  }

  type ProposalVote {
    voter: String
    option: String
  }

  type ProposalTallyResult {
    yes: String
    abstain: String
    no: String
    no_with_veto: String
  }

  type ProposalContent {
    type: String
    value: ProposalContentValue
  }

  type ProposalChange {
    subspace: String
    key: String
    value: String
  }
  type ProposalContentValue {
    title: String
    description: String
    changes: [ProposalChange]
  }
`
