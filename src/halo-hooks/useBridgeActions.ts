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
  primaryBridgeContractAddress: string,
  wrappedTokenAddress: string,
  secondaryBridgeContractAddress: string
) => {
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const tokenContract = useTokenContract(tokenAddress)
  const primaryBridgeContract = useContract(primaryBridgeContractAddress, PRIMARY_BRIDGE_ABI)
  const wrappedTokenContract = useTokenContract(wrappedTokenAddress)
  const secondaryBridgeContract = useContract(secondaryBridgeContractAddress, SECONDARY_BRIDGE_ABI)

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

  const giveSecondaryBridgeAllowance = useCallback(
    async (amount: BigNumber) => {
      try {
        const tx = await wrappedTokenContract?.approve(secondaryBridgeContract?.address, amount)
        addTransaction(tx, { summary: 'Give bridge allowance' })
        return tx
      } catch (e) {
        throw new Error(e)
      }
    },
    [addTransaction, wrappedTokenContract, secondaryBridgeContract]
  )

  const burnWrappedTokens = useCallback(
    async (amount: BigNumber) => {
      try {
        const tx = await secondaryBridgeContract?.burn(amount)
        addTransaction(tx, { summary: 'Burn wrapped tokens' })
        return tx
      } catch (e) {
        throw new Error(e)
      }
    },
    [addTransaction, secondaryBridgeContract]
  )

  return {
    primaryBridgeContract,
    giveBridgeAllowance,
    depositToPrimaryBridge,
    giveSecondaryBridgeAllowance,
    burnWrappedTokens
  }
}
