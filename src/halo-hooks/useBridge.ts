import { useCallback, useState, useEffect } from 'react'
import { Contract } from '@ethersproject/contracts'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'
import { useTokenContract, useContract } from 'hooks/useContract'
import PRIMARY_BRIDGE_ABI from '../constants/bridgeAbis/PrimaryBridge.json'

export default (tokenAddress: string, chainIdOrigin: number, chainIdDestination: number) => {
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const tokenContract = useTokenContract(tokenAddress)

  const [primaryBridgeContract, setPrimaryBridgeContract] = useState<Contract | null>(null)

  /** @todo Using useEffect fetch from API, using token address as key */
  useEffect(() => {
    fetch(`${process.env.BRIDGE_API_BASE_URL}/bridge-contracts`)
      .then((response: any) => response.json())
      .then((result: any) => {
        console.log('result:', result)
        setPrimaryBridgeContract(useContract(result.bridgeContract, PRIMARY_BRIDGE_ABI))
      })
  }, [primaryBridgeContract])

  const giveBridgeAllowance = useCallback(
    async (amount: number) => {
      try {
        const tx = await tokenContract?.approve(primaryBridgeContract?.address, amount)
        addTransaction(tx, { summary: 'Give primary bridge allowance' })
        return tx
      } catch (e) {
        throw new Error(e)
      }
    },
    [addTransaction, tokenContract, primaryBridgeContract]
  )

  const depositToPrimaryBridge = useCallback(
    async (amount: number, chainIdDestination: number) => {
      try {
        const tx = await primaryBridgeContract?.deposit(amount, chainIdDestination)
        addTransaction(tx, { summary: 'Deposit on bridge' })
        return tx
      } catch (e) {
        throw new Error(e)
      }
    },
    [addTransaction, primaryBridgeContract]
  )

  return { primaryBridgeContract, giveBridgeAllowance, depositToPrimaryBridge }
}
