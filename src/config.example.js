const dev = process.env.NODE_ENV === `development`;
const stargate = process.env.STARGATE || `https://lcd.testnet-2.bitsong.network`;
const rpc = process.env.RPC || `https://lcd.testnet-2.bitsong.network`;
const dbUri = `mongodb://localhost:27017/bitsong-testnet-2?replicaSet=replica01`;
const prefix = {
  bech32PrefixAccAddr: "bitsong", // Bech32PrefixAccAddr defines the Bech32 prefix of an account's address
  bech32PrefixAccPub: "bitsongpub", // Bech32PrefixAccPub defines the Bech32 prefix of an account's public key
  bech32PrefixValAddr: "bitsongvaloper", // Bech32PrefixValAddr defines the Bech32 prefix of a validator's operator address
  bech32PrefixValPub: "bitsongvaloperpub", // Bech32PrefixValPub defines the Bech32 prefix of a validator's operator public key
  bech32PrefixConsAddr: "bitsongvalcons", // Bech32PrefixConsAddr defines the Bech32 prefix of a consensus node address
  bech32PrefixConsPub: "bitsongvalconspub" // Bech32PrefixConsPub defines the Bech32 prefix of a consensus node public key
};

export default {
  development: dev,
  network: process.env.NETWORK || `bitsong-testnet-2`,
  stargate,
  rpc,
  dbUri,
  enableGraphiQl: true,
  prefix
};
