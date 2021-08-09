import { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BigNumber } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'
import { useTokenContract, useContract } from 'hooks/useContract'
import PRIMARY_BRIDGE_ABI from 'constants/bridgeAbis/PrimaryBridge.json'
import SECONDARY_BRIDGE_ABI from 'constants/bridgeAbis/SecondaryBridge.json'
import { setPrimaryBridgeContract, setSecondaryBridgeContract } from 'state/bridge/actions'
import { AppState } from 'state/'
import { BridgeToken } from 'constants/bridge'

export const useAppoveBridgeDepositCallback = () => {
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const dispatch = useDispatch()

  const bridgeToken = useSelector<AppState, BridgeToken>(state => state.bridge.bridgeToken)
  const tokenAddress = useSelector<AppState, string>(state => state.bridge.tokenAddress)
  const primaryBridgeContractAddress = useSelector<AppState, string>(state => state.bridge.primaryBridgeContract)
  const wrappedTokenAddress = useSelector<AppState, string>(state => state.bridge.wrappedTokenAddress)
  const secondaryBridgeContractAddress = useSelector<AppState, string>(state => state.bridge.secondaryBridgeContract)
  const destinationChainId = useSelector<AppState, number>(state => state.bridge.destinationChainId)

  // let tokenContract, primaryBridgeContract, wrappedTokenContract, secondaryBridgeContract

  const tokenContract = useTokenContract(tokenAddress)
  const primaryBridgeContract = useContract(primaryBridgeContractAddress, PRIMARY_BRIDGE_ABI)
  const wrappedTokenContract = useTokenContract(wrappedTokenAddress)
  const secondaryBridgeContract = useContract(secondaryBridgeContractAddress, SECONDARY_BRIDGE_ABI)

  const mutateContracts = () => {

  }

  useEffect(() => {
    console.log('bridgeToken before', primaryBridgeContractAddress)
    dispatch(setPrimaryBridgeContract({ contractAddress: bridgeToken.primaryBridgeContract[chainId as number] }))
    console.log('bridgeToken after', bridgeToken.primaryBridgeContract)
    console.log('primaryBridgeContract.address:', primaryBridgeContract?.address)
    
  }, [chainId])

  useEffect(() => {
    dispatch(
      setSecondaryBridgeContract({
        contractAddress: bridgeToken.secondaryBridgeContracts[destinationChainId as number]
      })
    )
  }, [destinationChainId])

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
        console.log('secondaryBridgeContract:', secondaryBridgeContract)
        console.log('secondaryBridgeContractAddress:', secondaryBridgeContractAddress)
        console.log('giveSecondaryBridgeAllowance #chainId', chainId)
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
