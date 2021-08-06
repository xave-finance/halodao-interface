import { useCallback, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BigNumber } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'
import { useTokenContract, useContract } from 'hooks/useContract'
import PRIMARY_BRIDGE_ABI from '../constants/bridgeAbis/PrimaryBridge.json'
import SECONDARY_BRIDGE_ABI from '../constants/bridgeAbis/SecondaryBridge.json'
import { fetchBridgeContract } from '../state/bridge/actions'

export const useAppoveBridgeDepositCallback = (
  tokenAddress: string,
  bridgeContractAddress: string,
  chainIdOrigin: number,
  chainIdDestination: number
) => {
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  console.log('bridgeContractAddress:', bridgeContractAddress)

  const tokenContract = useTokenContract(tokenAddress)
  const primaryBridgeContract = useContract(bridgeContractAddress, PRIMARY_BRIDGE_ABI)
  const secondaryBridgeContract = useContract('0xF755e3125b171A70f24768d843AB75A50A045ea6', SECONDARY_BRIDGE_ABI)

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
