import { useState, useCallback } from 'react'
import { ChainId } from '@halodao/sdk'
import { useActiveWeb3React } from './index'
import useInterval from 'hooks/useInterval'

type ChainConfirmationList = {
  readonly [chainId in ChainId]?: number
}

const CHAIN_REQUIRED_CONFIRMATIONS: ChainConfirmationList = {
  [ChainId.MAINNET]: 24,
  [ChainId.MATIC]: 200
}

export default function useTransactionConfirmation(txHash: string) {
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
