import { useCallback, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'

import Fraction from '../constants/Fraction'
import { BalanceProps } from '../sushi-hooks/queries/useTokenBalance'
import { useTokenContract, useContract } from 'hooks/useContract'
import HALOHALO_ABI from '../constants/haloAbis/HaloHalo.json'
import { HALO_TOKEN_ADDRESS, HALOHALO_ADDRESS } from '../constants'

const { BigNumber } = ethers

const useHaloHalo = () => {
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const haloContract = useTokenContract(chainId ? HALO_TOKEN_ADDRESS[chainId] : undefined || '') // withSigner
  const chestContract = useContract(chainId ? HALOHALO_ADDRESS[chainId] : undefined || '', HALOHALO_ABI) // withSigner

  const [allowance, setAllowance] = useState('0')

  const fetchAllowance = useCallback(async () => {
    if (account) {
      try {
        const allowance = await haloContract?.allowance(account, chestContract?.address)
        const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString()
        setAllowance(formatted)
      } catch {
        setAllowance('0')
      }
    }
  }, [account, chestContract, haloContract])

  useEffect(() => {
    if (account && chestContract && haloContract) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, chestContract, fetchAllowance, haloContract])

  const approve = useCallback(async () => {
    try {
      const tx = await haloContract?.approve(chestContract?.address, ethers.constants.MaxUint256.toString())
      return addTransaction(tx, { summary: 'Approve' })
    } catch (e) {
      return e
    }
  }, [addTransaction, chestContract, haloContract])

  const enter = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await chestContract?.enter(amount?.value)
          return addTransaction(tx, { summary: 'Enter HALOHALO' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, chestContract]
  )

  const leave = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await chestContract?.leave(amount?.value)
          //const tx = await chestContract?.leave(ethers.utils.parseUnits(amount)) // where amount is string
          return addTransaction(tx, { summary: 'Leave HALOHALO' })
        } catch (e) {
          return e
        }
      }
    },
    [addTransaction, chestContract]
  )

  return { allowance, approve, enter, leave }
}

export default useHaloHalo
