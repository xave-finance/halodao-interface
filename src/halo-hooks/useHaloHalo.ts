import { useCallback, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'

import Fraction from '../constants/Fraction'
import { BalanceProps } from '../sushi-hooks/queries/useTokenBalance'
import { useTokenContract, useContract } from 'hooks/useContract'
import HALOHALO_ABI from '../constants/haloAbis/HaloHalo.json'
import { HALO_TOKEN_ADDRESS, HALOHALO_ADDRESS, HALO_REWARDS_MANAGER_ADDRESS } from '../constants'
import { formatNumber } from 'utils/formatNumber'
import { ChainId } from '@sushiswap/sdk'

const { BigNumber } = ethers

const useHaloHalo = () => {
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const overrideCurrentProvider = chainId && chainId === ChainId.MATIC ? true : false // user RPCProvider to connect to mainnet if user is in MATIC
  const contractChainId = chainId && chainId === ChainId.MATIC ? ChainId.MAINNET : chainId
  const haloHaloAddress = chainId ? HALOHALO_ADDRESS[contractChainId as ChainId] : undefined
  const rewardsManagerAddress = chainId ? HALO_REWARDS_MANAGER_ADDRESS[contractChainId as ChainId] : undefined
  const haloContract = useTokenContract(
    chainId ? HALO_TOKEN_ADDRESS[contractChainId as ChainId] : undefined || '',
    true,
    overrideCurrentProvider
  ) // withSigner
  const halohaloContract = useContract(haloHaloAddress || '', HALOHALO_ABI, true, overrideCurrentProvider) // withSigner
  const [allowance, setAllowance] = useState('0')
  const [haloHaloAPY, setHaloHaloAPY] = useState(0)
  const [haloHaloPrice, setHaloHaloPrice] = useState('0')

  // gets the current APY from the haloHalo contract
  const getAPY = useCallback(async () => {
    if (!rewardsManagerAddress || !haloContract || !halohaloContract) return
    try {
      const bal = await haloContract?.balanceOf(rewardsManagerAddress)
      const supply = await halohaloContract?.totalSupply()
      const apy = Number(Fraction.from(bal, supply).toString()) * 12

      setHaloHaloAPY(apy)
    } catch (e) {
      console.log('error in getAPY')
      return e
    }
  }, [haloContract, halohaloContract, rewardsManagerAddress])

  const getHaloHaloPrice = useCallback(async () => {
    if (!haloHaloAddress || !haloContract || !halohaloContract) return

    const bal = await haloContract?.balanceOf(haloHaloAddress)
    const supply = await halohaloContract?.totalSupply()
    const price = Fraction.from(bal, supply)

    setHaloHaloPrice(formatNumber(Number(price.toString())))
  }, [haloContract, halohaloContract, haloHaloAddress])

  const fetchAllowance = useCallback(async () => {
    if (account) {
      try {
        const allowance = await haloContract?.allowance(account, halohaloContract?.address)
        const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
        setAllowance(formatted)
      } catch {
        setAllowance('0')
      }
    }
  }, [account, halohaloContract, haloContract])

  useEffect(() => {
    if (account && halohaloContract && haloContract) {
      fetchAllowance()
      getHaloHaloPrice()
      getAPY()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, halohaloContract, fetchAllowance, haloContract, getAPY, getHaloHaloPrice])

  const approve = useCallback(async () => {
    try {
      const tx = await haloContract?.approve(halohaloContract?.address, ethers.constants.MaxUint256.toString())
      return addTransaction(tx, { summary: 'Approve' })
    } catch (e) {
      return e
    }
  }, [addTransaction, halohaloContract, haloContract])

  const enter = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await halohaloContract?.enter(amount?.value)
          addTransaction(tx, { summary: 'Deposit RNBW' })
          return tx
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, halohaloContract]
  )

  const leave = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await halohaloContract?.leave(amount?.value)
          addTransaction(tx, { summary: 'Claim RNBW' })
          return tx
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, halohaloContract]
  )

  return { allowance, approve, enter, leave, haloHaloAPY, haloHaloPrice }
}

export default useHaloHalo
