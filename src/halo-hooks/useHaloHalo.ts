import { useCallback, useState, useEffect } from 'react'
import { ethers, providers } from 'ethers'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'

import Fraction from '../constants/Fraction'
import { BalanceProps } from '../sushi-hooks/queries/useTokenBalance'
import { useTokenContract, useContract } from 'hooks/useContract'
import HALOHALO_ABI from '../constants/haloAbis/HaloHalo.json'
import { HALO_TOKEN_ADDRESS, HALOHALO_ADDRESS } from '../constants'
import { formatEther } from 'ethers/lib/utils'

const { BigNumber } = ethers

const useHaloHalo = () => {
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const haloContract = useTokenContract(chainId ? HALO_TOKEN_ADDRESS[chainId] : undefined || '') // withSigner
  const halohaloContract = useContract(chainId ? HALOHALO_ADDRESS[chainId] : undefined || '', HALOHALO_ABI) // withSigner

  const [allowance, setAllowance] = useState('0')
  const [haloHaloAPY, setHaloHaloAPY] = useState('0')
  const [haloHaloPrice, setHaloHaloPrice] = useState('0')

  // gets the current APY from the haloHalo contract
  const getAPY = useCallback(async () => {
    // fixed to 2 decimal points\
    const currentBlockNumber = await providers?.getDefaultProvider().getBlockNumber()
    const genesisTimestamp = Number(await halohaloContract?.genesisTimestamp())
    const currentTimestamp = await (await providers?.getDefaultProvider().getBlock(currentBlockNumber)).timestamp

    // one year in seconds / 31536000
    const timeElapsed = currentTimestamp - genesisTimestamp
    console.log(`Genesis timestamp is ${genesisTimestamp}, current block timestamp is ${currentTimestamp}`)

    // 1 comes from the 1:1 ratio before adding rewards
    const priceChange = +haloHaloPrice - 1
    const APY = timeElapsed * priceChange

    setHaloHaloAPY(APY.toString())
  }, [halohaloContract, haloHaloPrice])

  const getHaloHaloPrice = useCallback(async () => {
    const currentHaloHaloPrice = await halohaloContract?.getCurrentHaloHaloPrice()

    setHaloHaloPrice(formatEther(currentHaloHaloPrice))
  }, [halohaloContract])

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
          return addTransaction(tx, { summary: 'Enter HALOHALO' })
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
          return addTransaction(tx, { summary: 'Leave HALOHALO' })
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
