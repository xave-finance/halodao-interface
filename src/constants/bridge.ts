import { ChainId } from '@sushiswap/sdk'

import { ZERO_ADDRESS } from '../constants/'

export const BRIDGE_CONTRACTS = {
  // TAUD
  [process.env.REACT_APP_TAUD_ADDRESS_MAINNET as string]:
    process.env.REACT_APP_TAUD_MAINNET_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  [process.env.REACT_APP_TAUD_ADDRESS_MATIC as string]:
    process.env.REACT_APP_TAUD_MATIC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  // TCAD
  [process.env.REACT_APP_TCAD_ADDRESS_MAINNET as string]:
    process.env.REACT_APP_TCAD_MAINNET_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  [process.env.REACT_APP_TCAD_ADDRESS_MATIC as string]:
    process.env.REACT_APP_TCAD_MATIC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  // TGBP
  [process.env.REACT_APP_TGBP_ADDRESS_MAINNET as string]:
    process.env.REACT_APP_TGBP_MAINNET_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  [process.env.REACT_APP_TGBP_ADDRESS_MATIC as string]:
    process.env.REACT_APP_TGBP_MATIC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
}

export const ORIGINAL_TOKEN_CHAIN_ID = {
  // TAUD
  [process.env.REACT_APP_TAUD_ADDRESS_MAINNET as string]: ChainId.MAINNET,
  [process.env.REACT_APP_TAUD_ADDRESS_MATIC as string]: ChainId.MAINNET,

  // TCAD
  [process.env.REACT_APP_TCAD_ADDRESS_MAINNET as string]: ChainId.MAINNET,
  [process.env.REACT_APP_TCAD_ADDRESS_MATIC as string]: ChainId.MAINNET,

  // TGBP
  [process.env.REACT_APP_TGBP_ADDRESS_MAINNET as string]: ChainId.MAINNET,
  [process.env.REACT_APP_TGBP_ADDRESS_MATIC as string]: ChainId.MAINNET
}
