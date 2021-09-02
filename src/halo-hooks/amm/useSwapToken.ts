import { useCallback, useEffect, useState } from 'react'
import { useContract } from 'hooks/useContract'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import CURVE_FACTORY_ABI from 'constants/haloAbis/CurveFactory.json'
import ROUTER_ABI from 'constants/haloAbis/Router.json'
import ASSIMILATOR_ABI from 'constants/haloAbis/Assimilator.json'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { ethers } from 'ethers'
import { getContract } from 'utils'
import { ChainId, Token } from '@sushiswap/sdk'
import { AssimilatorAddressMap, haloAssimilators, haloUSDC, TokenSymbol } from 'constants/tokenLists/halo-tokenlist'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { ERC20_ABI } from 'constants/abis/erc20'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'

type ChainAddressMap = {
  readonly [chainId in ChainId]?: string
}

const curveFactoryAddress: ChainAddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.KOVAN]: '0x829a33f041ee89bf969948d42287d0791fb83277',
  [ChainId.MATIC]: '0xED8EC3AA3CAA01820acE2Da16DC576D734c55a0b'
}

const routerAddress: ChainAddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.KOVAN]: '0xa02dCeB15cc32249beC33C2808b4799a44F8B0D5',
  [ChainId.MATIC]: '0x41752aB22C4885F9CBBCB8081f9775C3988DdaFB'
}

export const useSwapToken = (toCurrency: Token, fromCurrency: Token) => {
  const { account, chainId, library } = useActiveWeb3React()
  const [price, setPrice] = useState<number>()
  const currentBlockTime = useCurrentBlockTimestamp()
  const [minimumAmount, setMinimumAmount] = useState<string | undefined>()
  const [allowance, setAllowance] = useState('0')
  const addTransaction = useTransactionAdder()
  const CurveFactory = useContract(curveFactoryAddress[chainId!], CURVE_FACTORY_ABI, true)

  const getFutureTime = useCallback(
    (addMinutes: number) => {
      if (currentBlockTime) {
        return currentBlockTime.add(addMinutes).toNumber()
      } else {
        return new Date().getTime() + addMinutes
      }
    },
    [currentBlockTime]
  )

  const getCurrencyContract = useCallback(
    async (address: string) => {
      if (!library || !account) return

      return getContract(address, ERC20_ABI, library, true && account)
    },
    [library, account]
  )

  const getCurve = useCallback(async () => {
    // TODO: If not USDC then return router

    if (!library || !account) return
    try {
      const curveContractAddress = await CurveFactory?.getCurve(
        fromCurrency.symbol === TokenSymbol.USDC ? toCurrency.address : fromCurrency.address,
        fromCurrency.symbol === TokenSymbol.USDC ? fromCurrency.address : toCurrency.address
      )
      return getContract(curveContractAddress, CURVE_ABI, library, true && account)
    } catch (e) {
      return
    }
  }, [CurveFactory, fromCurrency.address, fromCurrency.symbol, toCurrency.address, library, account])

  const getRouter = useCallback(async () => {
    if (!library || !account || !chainId) return

    return getContract(routerAddress[chainId]!, ROUTER_ABI, library, true && account)
  }, [])

  const getPrice = useCallback(async () => {
    if (!chainId || !library) return

    try {
      const toTokenAssimilatorContract = getContract(
        (haloAssimilators[chainId as ChainId] as AssimilatorAddressMap)[toCurrency.symbol! as TokenSymbol],
        ASSIMILATOR_ABI,
        library
      )

      const fromTokenAssimilatorContract = getContract(
        (haloAssimilators[chainId as ChainId] as AssimilatorAddressMap)[fromCurrency.symbol! as TokenSymbol],
        ASSIMILATOR_ABI,
        library
      )

      const toCurrencyRate = await toTokenAssimilatorContract.getRate()
      const fromCurrencyRate = await fromTokenAssimilatorContract.getRate()

      setPrice(fromCurrencyRate / toCurrencyRate)
    } catch (e) {
      console.log(e)
    }
  }, [chainId, library, fromCurrency.symbol, toCurrency.symbol])

  const getMinimumAmount = useCallback(
    async (amount: string) => {
      const CurveContract = await getRouter()

      if (!CurveContract || !chainId) return

      const quoteAmount = parseUnits(amount, fromCurrency.decimals)
      const res = await CurveContract?.viewOriginSwap(
        haloUSDC[chainId]?.address,
        fromCurrency.address,
        toCurrency.address,
        quoteAmount
      )
      setMinimumAmount(formatUnits(res, toCurrency.decimals))
    },
    [fromCurrency.address, fromCurrency.decimals, toCurrency.address, toCurrency.decimals, toCurrency.symbol, getCurve]
  )

  const fetchAllowance = useCallback(async () => {
    if (account) {
      const CurveContract = await getRouter()
      const tokenContract = await getCurrencyContract(fromCurrency.address)

      try {
        const allowance = await tokenContract?.allowance(account, CurveContract?.address)
        console.log('Allowance: ', formatUnits(allowance))
        setAllowance(String(allowance))
      } catch {
        setAllowance('0')
      }
    }
  }, [account, getCurve, fromCurrency.address, getCurrencyContract])

  const approve = useCallback(async () => {
    const CurveContract = await getRouter()
    const tokenContract = await getCurrencyContract(fromCurrency.address)

    try {
      const tx = await tokenContract?.approve(CurveContract?.address, ethers.constants.MaxUint256)

      return addTransaction(tx, { summary: 'Approve' })
    } catch (e) {
      return e
    }
  }, [addTransaction, getCurve, fromCurrency.address, getCurrencyContract])

  useEffect(() => {
    if (account) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, fetchAllowance])

  const swapToken = useCallback(
    async (amount: string, deadline?: number) => {
      if (!chainId || !library) return

      const CurveContract = await getRouter()

      const quoteAmount = parseUnits(amount, fromCurrency.decimals)

      try {
        const tx = await CurveContract?.originSwap(
          haloUSDC[chainId]?.address,
          fromCurrency.address,
          toCurrency.address,
          quoteAmount,
          0,
          deadline ? getFutureTime(deadline) : getFutureTime(60)
        )
        tx.wait()

        addTransaction(tx, { summary: `Swap to ${toCurrency.name}` })
        return tx
      } catch (e) {
        return null
      }

      /*

      if (toCurrency.symbol === TokenSymbol.USDC) {
        const baseAmount = parseUnits(amount, fromCurrency.decimals)

        try {
          const tx = await CurveContract?.targetSwap(
            toCurrency.address,
            fromCurrency.address,
            baseAmount,
            0,
            deadline ? getFutureTime(deadline) : getFutureTime(60)
          )
          addTransaction(tx, { summary: 'Swap to USDC' })
          tx.wait()

          return tx
        } catch (e) {
          return null
        }
      } else {
        const quoteAmount = parseUnits(amount, fromCurrency.decimals)
        try {
          const tx = await CurveContract?.originSwap(
            fromCurrency.address,
            toCurrency.address,
            quoteAmount,
            0,
            deadline ? getFutureTime(deadline) : getFutureTime(60)
          )
          tx.wait()

          addTransaction(tx, { summary: `Swap to ${toCurrency.name}` })
          return tx
        } catch (e) {
          return null
        }
      }
      */
    },
    [
      addTransaction,
      fromCurrency.address,
      fromCurrency.decimals,
      getCurve,
      toCurrency.address,
      toCurrency.symbol,
      toCurrency.name,
      getFutureTime
    ]
  )

  return { getPrice, getCurve, getMinimumAmount, price, minimumAmount, allowance, approve, swapToken, fetchAllowance }
}
