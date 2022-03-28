import { useCallback, useEffect, useState } from 'react'
import ROUTER_ABI from 'constants/haloAbis/Router.json'
import ASSIMILATOR_ABI from 'constants/haloAbis/Assimilator.json'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { ethers } from 'ethers'
import { getContract } from 'utils'
import { ChainId, Token } from '@halodao/sdk'
import {
  AssimilatorAddressMap,
  haloAssimilators,
  haloUSDC,
  routerAddress,
  TokenSymbol
} from 'constants/tokenLists/halo-tokenlist'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { ERC20_ABI } from 'constants/abis/erc20'
import { toFixed } from 'utils/formatNumber'
import { SwapButtonState } from 'constants/buttonStates'
import { useTime } from 'halo-hooks/useTime'

export enum CurrencySide {
  TO_CURRENCY = 'toCurrency',
  FROM_CURRENCY = 'fromCurrency'
}

export const useSwapToken = (
  toCurrency: Token,
  fromCurrency: Token,
  setButtonState: (state: SwapButtonState) => void
) => {
  const { account, chainId, library } = useActiveWeb3React()
  const [price, setPrice] = useState<number>()
  const [isLoadingPrice, setIsLoadingPrice] = useState(false)
  const { getFutureTime } = useTime()
  const [toMinimumAmount, setToMinimumAmount] = useState<string | undefined>()
  const [fromMinimumAmount, setFromMinimumAmount] = useState<string | undefined>()
  const [isLoadingMinimumAmount, setIsLoadingMinimumAmount] = useState(false)
  const [allowance, setAllowance] = useState('0')
  const addTransaction = useTransactionAdder()

  const toSafeValue = useCallback(
    (value: string, currencySide: CurrencySide) => {
      if (value.charAt(value.length - 1) === '.') {
        return value.substring(0, value.length - 1)
      } else {
        return toFixed(
          Number(value),
          currencySide === CurrencySide.TO_CURRENCY ? fromCurrency.decimals : toCurrency.decimals
        )
      }
    },
    [fromCurrency.decimals, toCurrency.decimals]
  )

  const getCurrencyContract = useCallback(
    async (address: string) => {
      if (!library || !account) return

      return getContract(address, ERC20_ABI, library, true && account)
    },
    [library, account]
  )

  const getRouter = useCallback(async () => {
    if (!library || !account || !chainId) return

    const address = routerAddress[chainId]
    if (!address || address === ethers.constants.AddressZero) return

    return getContract(address, ROUTER_ABI, library, true && account)
  }, [account, chainId, library])

  const getPrice = useCallback(async () => {
    if (!chainId || !library) return
    setIsLoadingPrice(true)
    try {
      const toTokenAssimilatorContract = getContract(
        (haloAssimilators[chainId as ChainId] as AssimilatorAddressMap)[toCurrency.symbol as TokenSymbol],
        ASSIMILATOR_ABI,
        library
      )

      const fromTokenAssimilatorContract = getContract(
        (haloAssimilators[chainId as ChainId] as AssimilatorAddressMap)[fromCurrency.symbol as TokenSymbol],
        ASSIMILATOR_ABI,
        library
      )

      const toCurrencyRate = await toTokenAssimilatorContract.getRate()
      const fromCurrencyRate = await fromTokenAssimilatorContract.getRate()

      setPrice(fromCurrencyRate / toCurrencyRate)
    } catch (e) {
      console.log(e)
    }
    setIsLoadingPrice(false)
  }, [chainId, library, fromCurrency.symbol, toCurrency.symbol])

  const getMinimumAmount = useCallback(
    async (amount: string, currencySide: CurrencySide) => {
      // currencySide is the unknown
      setIsLoadingMinimumAmount(true)
      const CurveContract = await getRouter()

      if (!CurveContract || !chainId) return

      const quoteAmount = parseUnits(
        toSafeValue(amount, currencySide),
        currencySide === CurrencySide.TO_CURRENCY ? fromCurrency.decimals : toCurrency.decimals
      )
      try {
        const res =
          currencySide === CurrencySide.TO_CURRENCY
            ? await CurveContract?.viewOriginSwap(
                haloUSDC[chainId]?.address,
                fromCurrency.address,
                toCurrency.address,
                quoteAmount
              )
            : await CurveContract?.viewTargetSwap(
                haloUSDC[chainId]?.address,
                fromCurrency.address,
                toCurrency.address,
                quoteAmount
              )
        currencySide === CurrencySide.TO_CURRENCY
          ? setToMinimumAmount(formatUnits(res, toCurrency.decimals))
          : setFromMinimumAmount(formatUnits(res, fromCurrency.decimals))
      } catch (e) {
        setButtonState(SwapButtonState.InsufficientLiquidity)
      }
      setIsLoadingMinimumAmount(false)
    },
    [
      fromCurrency.address,
      fromCurrency.decimals,
      toCurrency.address,
      toCurrency.decimals,
      chainId,
      getRouter,
      toSafeValue,
      setButtonState
    ]
  )

  const fetchAllowance = useCallback(async () => {
    if (account) {
      const CurveContract = await getRouter()
      const tokenContract = await getCurrencyContract(fromCurrency.address)

      try {
        const allowance = await tokenContract?.allowance(account, CurveContract?.address)
        setAllowance(String(allowance))
      } catch {
        setAllowance('0')
      }
    }
  }, [account, fromCurrency.address, getCurrencyContract, getRouter])

  const approve = useCallback(async () => {
    const CurveContract = await getRouter()
    const tokenContract = await getCurrencyContract(fromCurrency.address)

    try {
      const tx = await tokenContract?.approve(CurveContract?.address, ethers.constants.MaxUint256)
      await tx.wait()

      return addTransaction(tx, { summary: 'Approve' })
    } catch (e) {
      return e
    }
  }, [addTransaction, fromCurrency.address, getCurrencyContract, getRouter])

  useEffect(() => {
    if (account) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, fetchAllowance])

  const swapToken = useCallback(
    async (amount: string, deadline?: number, slippage?: number) => {
      if (!chainId || !library) return

      const CurveContract = await getRouter()

      const quoteAmount = parseUnits(amount, fromCurrency.decimals)

      const minimumAmountSwap = Number(toMinimumAmount) * (1 - (slippage ? slippage / 100 : 0.01))
      const parsedMinimumAmountSwap = parseUnits(toFixed(minimumAmountSwap, toCurrency.decimals), toCurrency.decimals)

      try {
        const tx = await CurveContract?.originSwap(
          haloUSDC[chainId]?.address,
          fromCurrency.address,
          toCurrency.address,
          quoteAmount,
          parsedMinimumAmountSwap,
          deadline ? getFutureTime(deadline * 60) : getFutureTime(60)
        )

        await tx.wait()

        addTransaction(tx, { summary: `Swap to ${toCurrency.name}` })

        return tx
      } catch (e) {
        return e
      }
    },
    [
      addTransaction,
      fromCurrency.address,
      fromCurrency.decimals,
      toCurrency.address,
      toCurrency.name,
      toCurrency.decimals,
      getFutureTime,
      chainId,
      getRouter,
      library,
      toMinimumAmount
    ]
  )

  return {
    getPrice,
    getMinimumAmount,
    price,
    isLoadingPrice,
    toMinimumAmount,
    fromMinimumAmount,
    isLoadingMinimumAmount,
    allowance,
    approve,
    swapToken,
    fetchAllowance,
    toSafeValue
  }
}
