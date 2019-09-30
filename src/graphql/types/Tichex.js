/*
- issuer
    ***** go-tichex/MsgCreateIssuer
- token
    ***** go-tichex/MsgMint
    ***** go-tichex/MsgBurn
    ***** go-tichex/MsgIssue
    ***** go-tichex/MsgSend
    ***** go-tichex/MsgFreeze
    ***** go-tichex/MsgUnfreeze
*/

export default `
type TokenIssue {
  issuer_address: String
  denom: String
  name: String
  decimals: String
  description: String
  freezable: Boolean
  transfer_fee: String
}

type IssuerDescription {
  name: String
  street: String
  identity: String
  website: String
  security_contact: String
  details: String
}

type Issuer {
  address: String
  description: IssuerDescription
}

type MsgCreateIssuer {
  issuer: Issuer
}

type MsgUnfreeze {
  issuer_address: String
  frozen_account_address: String
  denom: String
}

type MsgFreeze {
  issuer_address: String
  account_address: String
  denom: String
  reason: String
}

type MsgIssue {
  token: TokenIssue
}

type MsgBurn {
  issuer_address: String
  account_address: String
  coin: Coin
}

type MsgMint {
  issuer_address: String
  account_address: String
  coin: Coin
}
`;
