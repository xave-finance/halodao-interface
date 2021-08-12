import { ChainId } from '@sushiswap/sdk'

import { ZERO_ADDRESS } from '../constants/'

export const BRIDGE_CONTRACTS = {
  // MOCK
  [process.env.REACT_APP_MOCK_TOKEN_ADDRESS_MATIC as string]:
    process.env.REACT_APP_MOCK_MATIC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  [process.env.REACT_APP_MOCK_TOKEN_ADDRESS_XDAI as string]:
    process.env.REACT_APP_MOCK_XDAI_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  [process.env.REACT_APP_MOCK_TOKEN_ADDRESS_BSC as string]:
    process.env.REACT_APP_MOCK_BSC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  [process.env.REACT_APP_MOCK_TOKEN_ADDRESS_MAINNET as string]:
    process.env.REACT_APP_MOCK_BSC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,

  // RIO
  [process.env.REACT_APP_RIO_TOKEN_ADDRESS_MAINNET as string]:
    process.env.REACT_APP_RIO_MAINNET_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  [process.env.REACT_APP_RIO_TOKEN_ADDRESS_MATIC as string]:
    process.env.REACT_APP_RIO_MATIC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  [process.env.REACT_APP_RIO_TOKEN_ADDRESS_XDAI as string]:
    process.env.REACT_APP_RIO_XDAI_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS,
  [process.env.REACT_APP_RIO_TOKEN_ADDRESS_BSC as string]:
    process.env.REACT_APP_RIO_BSC_BRIDGE_CONTRACT_ADDRESS || ZERO_ADDRESS
}

export const ORIGINAL_TOKEN_CHAIN_ID = {
  // MOCK
  [process.env.REACT_APP_MOCK_TOKEN_ADDRESS_MATIC as string]: ChainId.MATIC,
  [process.env.REACT_APP_MOCK_TOKEN_ADDRESS_XDAI as string]: ChainId.MATIC,
  [process.env.REACT_APP_MOCK_TOKEN_ADDRESS_BSC as string]: ChainId.MATIC,

  // RIO
  [process.env.REACT_APP_RIO_TOKEN_ADDRESS_MATIC as string]: ChainId.MATIC,
  [process.env.REACT_APP_RIO_TOKEN_ADDRESS_XDAI as string]: ChainId.MATIC,
  [process.env.REACT_APP_RIO_TOKEN_ADDRESS_BSC as string]: ChainId.MATIC
}
