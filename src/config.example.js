const dev = process.env.NODE_ENV === `development`
const stargate =
  process.env.STARGATE ||
  (dev ? `https://lcd.testnet-2.bitsong.network` : `https://lcd.testnet-2.bitsong.network`)

const rpc =
  process.env.RPC || (dev ? `https://rpc.testnet-2.bitsong.network` : `https://rpc.testnet-2.bitsong.network`)

export default {
  development: dev,
  network: process.env.NETWORK || `bitsong-testnet-2`,
  stargate,
  rpc
}
