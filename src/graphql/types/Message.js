/*
- bank:
    ***** cosmos-sdk/MsgSend
    ***** cosmos-sdk/MsgMultiSend
-crisis
    ***** cosmos-sdk/MsgVerifyInvariant
- distribution
    ***** cosmos-sdk/MsgWithdrawDelegationReward
    ***** cosmos-sdk/MsgWithdrawValidatorCommission
    ***** cosmos-sdk/MsgModifyWithdrawAddress
- gov
    - cosmos-sdk/MsgSubmitProposal
    - cosmos-sdk/MsgDeposit
    - cosmos-sdk/MsgVote
- nft
    - cosmos-sdk/MsgTransferNFT
    - cosmos-sdk/MsgEditNFTMetadata
    - cosmos-sdk/MsgMintNFT
    - cosmos-sdk/MsgBurnNFT
- slashing
    ***** cosmos-sdk/MsgUnjail
- staking
    ***** cosmos-sdk/MsgCreateValidator
    ***** cosmos-sdk/MsgEditValidator
    ***** cosmos-sdk/MsgDelegate
    ***** cosmos-sdk/MsgUndelegate
    ***** cosmos-sdk/MsgBeginRedelegate
*/

// replica01:PRIMARY> db.messages.distinct("type");

export default `
  type Msg {
    type: String
    value: MsgValue
  }

  union MsgValue = MsgCreateIssuer | MsgUnfreeze | MsgFreeze | MsgIssue | MsgBurn | MsgMint | MsgSend | MsgMultiSend | MsgVerifyInvariant | MsgWithdrawDelegationReward | MsgModifyWithdrawAddress | MsgWithdrawValidatorCommission | MsgDelegate | MsgUnjail | MsgEditValidator  | MsgCreateValidator | MsgUndelegate | MsgBeginRedelegate

  type MsgSend {
    amount: [Coin]
    from_address: String
    to_address: String
  }

  type MsgMultiSend {
    inputs: [MsgMultiSendData]
    outputs: [MsgMultiSendData]
  }

  type MsgMultiSendData {
    address: String
    coins: [Coin]
  }

  type MsgVerifyInvariant {
    sender: String
    invariant_module_name: String
    invariant_route: String
  }

  type MsgWithdrawDelegationReward {
    delegator_address: String
    validator_address: String
  }

  type MsgModifyWithdrawAddress {
    delegator_address: String
    withdraw_address: String
  }

  type MsgWithdrawValidatorCommission {
    validator_address: String
  }

  type MsgDelegate {
    delegator_address: String
    validator_address: String
    amount: Coin
  }

  type MsgUnjail {
    address: String
  }

  type ValidatorDescription {
    moniker: String
    identity: String
    website: String
    details: String
  }

  type ValidatorCommission {
    rate: String
    max_rate: String
    max_change_rate: String
  }

  type MsgEditValidator {
    Description: ValidatorDescription
    address: String
    commission_rate: String
    min_self_delegation: String
  }

  type MsgCreateValidator {
    description: ValidatorDescription
    commission: ValidatorCommission
    min_self_delegation: String
    delegator_address: String
    validator_address: String
    pubkey: String
    value: Coin
  }

  type MsgUndelegate {
    delegator_address: String
    validator_address: String
    amount: Coin
  }

  type MsgBeginRedelegate {
    delegator_address: String
    validator_src_address: String
    validator_dst_address: String
    amount: Coin
  }
`;
