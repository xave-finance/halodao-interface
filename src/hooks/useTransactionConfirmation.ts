import { useState, useCallback } from 'react'
import { ChainId } from '@sushiswap/sdk'
import { useActiveWeb3React } from './index'
import useInterval from 'hooks/useInterval'

interface GetTransactionCall {
  confirmations: number
  requiredConfirmations: number
  done: boolean
}

type ChainConfirmationList = {
  readonly [chainId in ChainId]?: number
}

const CHAIN_REQUIRED_CONFIRMATIONS: ChainConfirmationList = {
  [ChainId.MAINNET]: 20,
  [ChainId.MATIC]: 192
}

export default function useTransactionConfirmation(txHash: string): GetTransactionCall {
  const { library, chainId } = useActiveWeb3React()

  const [confirmations, setConfirmations] = useState(0)
  const requiredConfirmations = CHAIN_REQUIRED_CONFIRMATIONS[chainId as ChainId] as number
  const [done, setDone] = useState(false)
  const fetchTransactionReceipt = useCallback(async () => {
    const txReceipt = await library?.getTransactionReceipt(txHash)
    setConfirmations(txReceipt?.confirmations as number)
    if ((txReceipt?.confirmations as number) >= requiredConfirmations) setDone(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library, txHash, confirmations])

  useInterval(fetchTransactionReceipt, confirmations < requiredConfirmations ? 10000 : null)

  return { confirmations, requiredConfirmations, done }
}
