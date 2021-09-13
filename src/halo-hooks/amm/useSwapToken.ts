import { useCallback, useEffect, useState } from 'react'
import ROUTER_ABI from 'constants/haloAbis/Router.json'
import ASSIMILATOR_ABI from 'constants/haloAbis/Assimilator.json'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { ethers } from 'ethers'
import { getContract } from 'utils'
import { ChainId, CurrencyAmount, Token } from '@sushiswap/sdk'
import { AssimilatorAddressMap, haloAssimilators, haloUSDC, TokenSymbol } from 'constants/tokenLists/halo-tokenlist'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { ERC20_ABI } from 'constants/abis/erc20'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { ChainAddressMap } from '../../constants'
import { toFixed } from 'utils/formatNumber'
import { ButtonState } from 'constants/buttonStates'

const routerAddress: ChainAddressMap = {
  [ChainId.MAINNET]: '',
  [ChainId.KOVAN]: '0xa02dCeB15cc32249beC33C2808b4799a44F8B0D5',
  [ChainId.MATIC]: '0x26f2860cdeB7cC785eE5d59a5Efb2D0D3842C39D'
}

export enum CurrencySide {
  TO_CURRENCY = 'toCurrency',
  FROM_CURRENCY = 'fromCurrency'
}

export const useSwapToken = (toCurrency: Token, fromCurrency: Token, setButtonState: (state: ButtonState) => void) => {
  const { account, chainId, library } = useActiveWeb3React()
  const [price, setPrice] = useState<number>()
  const currentBlockTime = useCurrentBlockTimestamp()
  const [minimumAmount, setMinimumAmount] = useState<string | undefined>()
  const [allowance, setAllowance] = useState('0')
  const addTransaction = useTransactionAdder()

  const toSafeValue = useCallback(
    (value: string) => {
      if (value.charAt(value.length - 1) === '.') {
        return value.substring(0, value.length - 1)
      } else {
        return toFixed(Number(value), fromCurrency.decimals)
      }
    },
    [fromCurrency.decimals]
  )

  const toSafeCurrencyValue = (value: CurrencyAmount, currencySide: CurrencySide) => {
    return value.toFixed(currencySide === CurrencySide.FROM_CURRENCY ? fromCurrency.decimals : toCurrency.decimals)
  }

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

  const getRouter = useCallback(async () => {
    if (!library || !account || !chainId) return

    return getContract(routerAddress[chainId] as string, ROUTER_ABI, library, true && account)
  }, [account, chainId, library])

  const getPrice = useCallback(async () => {
    if (!chainId || !library) return

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
  }, [chainId, library, fromCurrency.symbol, toCurrency.symbol])

  const getMinimumAmount = useCallback(
    async (amount: string) => {
      const CurveContract = await getRouter()

      if (!CurveContract || !chainId) return

      const quoteAmount = parseUnits(toSafeValue(amount), fromCurrency.decimals)
      try {
        const res = await CurveContract?.viewOriginSwap(
          haloUSDC[chainId]?.address,
          fromCurrency.address,
          toCurrency.address,
          quoteAmount
        )
        return formatUnits(res, toCurrency.decimals)
      } catch (e) {
        setButtonState(ButtonState.InsufficientLiquidity)
        return
      }
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

      const minimumAmountSwap = Number(minimumAmount) * (1 - (slippage ? slippage / 100 : 0.01))
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
        console.log(e)
        return null
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
      minimumAmount
    ]
  )

  return {
    getPrice,
    getMinimumAmount,
    price,
    minimumAmount,
    allowance,
    approve,
    swapToken,
    fetchAllowance,
    toSafeValue,
    toSafeCurrencyValue
  }
}
