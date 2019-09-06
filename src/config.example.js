const dev = process.env.NODE_ENV === `development`
const stargate =
  process.env.STARGATE ||
  (dev ? `https://lcd.sentinel-turing-1.bas.network` : `https://lcd.sentinel-turing-1.bas.network`)

const rpc =
  process.env.RPC || (dev ? `https://lcd.sentinel-turing-1.bas.network` : `https://rpc.sentinel-turing-1.bas.network`)

const dbUri = `mongodb://localhost:27017/sentinel?replicaSet=replica01`;

const prefix = {
  bech32PrefixAccAddr: "sent", // Bech32PrefixAccAddr defines the Bech32 prefix of an account's address
  bech32PrefixAccPub: "sentpub", // Bech32PrefixAccPub defines the Bech32 prefix of an account's public key
  bech32PrefixValAddr: "sentvaloper", // Bech32PrefixValAddr defines the Bech32 prefix of a validator's operator address
  bech32PrefixValPub: "sentvaloperpub", // Bech32PrefixValPub defines the Bech32 prefix of a validator's operator public key
  bech32PrefixConsAddr: "sentvalcons", // Bech32PrefixConsAddr defines the Bech32 prefix of a consensus node address
  bech32PrefixConsPub: "sentvalconspub" // Bech32PrefixConsPub defines the Bech32 prefix of a consensus node public key
}

export default {
  development: dev,
  network: process.env.NETWORK || `sentinel-turing-1`,
  stargate,
  rpc,
  dbUri,
  enableGraphiQl: true,
  prefix
}
