import { ChainId } from '@sushiswap/sdk'

import { ZERO_ADDRESS } from '../constants/'

export const BRIDGE_CONTRACTS = {
  // RNBW
  [process.env.REACT_APP_HALO_TOKEN_ADDRESS_MAINNET as string]:
    process.env.REACT_APP_HALO_MAINNET_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  [process.env.REACT_APP_HALO_TOKEN_ADDRESS_MATIC as string]:
    process.env.REACT_APP_HALO_MATIC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  // XRNBW
  [process.env.REACT_APP_HALOHALO_ADDRESS_MAINNET as string]:
    process.env.REACT_APP_HALOHALO_MAINNET_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  [process.env.REACT_APP_HALOHALO_ADDRESS_MATIC as string]:
    process.env.REACT_APP_HALOHALO_MATIC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
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

  // MOCK
  ...([process.env.REACT_APP_MOCK_TOKEN_MAINNET as string] && {
    [process.env.REACT_APP_MOCK_TOKEN_MAINNET as string]: process.env.REACT_APP_MOCK_MAINNET_BRIDGE_CONTRACT_ADDRESS
  }),
  ...([process.env.REACT_APP_MOCK_TOKEN_MATIC as string] && {
    [process.env.REACT_APP_MOCK_TOKEN_MATIC as string]: process.env.REACT_APP_MOCK_MATIC_BRIDGE_CONTRACT_ADDRESS
  })
}
console.log('BRIDGE_CONTRACTS:', BRIDGE_CONTRACTS)

export const ORIGINAL_TOKEN_CHAIN_ID = {
  // RNBW
  [process.env.REACT_APP_HALO_TOKEN_ADDRESS_MAINNET as string]: ChainId.MAINNET,
  [process.env.REACT_APP_HALO_TOKEN_ADDRESS_MATIC as string]: ChainId.MAINNET,
  // XRNBW
  [process.env.REACT_APP_HALOHALO_ADDRESS_MAINNET as string]: ChainId.MAINNET,
  [process.env.REACT_APP_HALOHALO_ADDRESS_MATIC as string]: ChainId.MAINNET,
  // TAUD
  [process.env.REACT_APP_TAUD_ADDRESS_MAINNET as string]: ChainId.MAINNET,
  [process.env.REACT_APP_TAUD_ADDRESS_MATIC as string]: ChainId.MAINNET,
  // TCAD
  [process.env.REACT_APP_TCAD_ADDRESS_MAINNET as string]: ChainId.MAINNET,
  [process.env.REACT_APP_TCAD_ADDRESS_MATIC as string]: ChainId.MAINNET,
  // TGBP
  [process.env.REACT_APP_TGBP_ADDRESS_MAINNET as string]: ChainId.MAINNET,
  [process.env.REACT_APP_TGBP_ADDRESS_MATIC as string]: ChainId.MAINNET,
  // MOCK
  ...(process.env.REACT_APP_MOCK_TOKEN_MAINNET && {
    [process.env.REACT_APP_MOCK_TOKEN_MAINNET as string]: ChainId.MATIC
  }),
  ...(process.env.REACT_APP_MOCK_TOKEN_MATIC && {
    [process.env.REACT_APP_MOCK_TOKEN_MATIC as string]: ChainId.MATIC
  })
}

export const ORIGINAL_TOKEN_CHAIN_ADDRESS = {
  // RNBW
  [process.env.REACT_APP_HALO_TOKEN_ADDRESS_MAINNET as string]: process.env
    .REACT_APP_HALO_TOKEN_ADDRESS_MAINNET as string,
  [process.env.REACT_APP_HALO_TOKEN_ADDRESS_MATIC as string]: process.env
    .REACT_APP_HALO_TOKEN_ADDRESS_MAINNET as string,
  // XRNBW
  // Note: It uses RNBW price feed since XRNBW price is not tracked by coingecko
  [process.env.REACT_APP_HALOHALO_ADDRESS_MAINNET as string]: process.env.REACT_APP_HALO_TOKEN_ADDRESS_MAINNET,
  [process.env.REACT_APP_HALOHALO_ADDRESS_MATIC as string]: process.env.REACT_APP_HALO_TOKEN_ADDRESS_MAINNET,
  // TAUD
  [process.env.REACT_APP_TAUD_ADDRESS_MAINNET as string]: process.env.REACT_APP_TAUD_ADDRESS_MAINNET,
  [process.env.REACT_APP_TAUD_ADDRESS_MATIC as string]: process.env.REACT_APP_TAUD_ADDRESS_MAINNET,
  // TCAD
  [process.env.REACT_APP_TCAD_ADDRESS_MAINNET as string]: process.env.REACT_APP_TCAD_ADDRESS_MAINNET,
  [process.env.REACT_APP_TCAD_ADDRESS_MATIC as string]: process.env.REACT_APP_TCAD_ADDRESS_MAINNET,
  // TGBP
  [process.env.REACT_APP_TGBP_ADDRESS_MAINNET as string]: process.env.REACT_APP_TGBP_ADDRESS_MAINNET,
  [process.env.REACT_APP_TGBP_ADDRESS_MATIC as string]: process.env.REACT_APP_TGBP_ADDRESS_MAINNET,

  // MOCK
  ...(process.env.REACT_APP_MOCK_TOKEN_MAINNET && {
    [process.env.REACT_APP_MOCK_TOKEN_MAINNET]: process.env.REACT_APP_MOCK_TOKEN_MAINNET
  }),
  ...(process.env.REACT_APP_MOCK_TOKEN_MATIC && {
    [process.env.REACT_APP_MOCK_TOKEN_MATIC]: process.env.REACT_APP_MOCK_TOKEN_MAINNET
  })
}
