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

const { BigNumber } = ethers

const useHaloHalo = () => {
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const haloHaloAddress = chainId ? HALOHALO_ADDRESS[chainId] : undefined
  const rewardsManagerAddress = chainId ? HALO_REWARDS_MANAGER_ADDRESS[chainId] : undefined

  const haloContract = useTokenContract(chainId ? HALO_TOKEN_ADDRESS[chainId] : undefined || '') // withSigner
  const halohaloContract = useContract(haloHaloAddress || '', HALOHALO_ABI) // withSigner

  const [allowance, setAllowance] = useState('0')
  const [haloHaloAPY, setHaloHaloAPY] = useState(0)
  const [haloHaloPrice, setHaloHaloPrice] = useState('0')

  // gets the current APY from the haloHalo contract
  const getAPY = useCallback(async () => {
    if (!rewardsManagerAddress || !haloContract || !halohaloContract) return

    const bal = await haloContract?.balanceOf(rewardsManagerAddress)
    const supply = await halohaloContract?.totalSupply()
    const apy = Number(Fraction.from(bal, supply).toString()) * 12

    setHaloHaloAPY(apy)
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
          addTransaction(tx, { summary: 'Deposit LPOP' })
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
          addTransaction(tx, { summary: 'Claim LPOP' })
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
