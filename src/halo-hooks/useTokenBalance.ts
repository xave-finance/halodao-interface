import { useCallback, useEffect, useState } from 'react'
import ERC20_ABI from '../constants/abis/erc20.json'
import { useBlockNumber } from '../state/application/hooks'
import { useActiveWeb3React } from '../hooks'
import { getContract } from '../utils'
import { formatUnits } from 'ethers/lib/utils'
import { Currency } from '@halodao/sdk'

export const useTokenBalance = (token: Currency | string) => {
  const { account, library } = useActiveWeb3React()
  const [balance, setBalance] = useState('0.0')

  const getCurrencyContract = useCallback(
    async (address: string) => {
      if (!library || !account) return
      return getContract(address, ERC20_ABI, library, account)
    },
    [library, account]
  )

  const fetchTokenBalance = useCallback(
    async token => {
      const currencyContract = await getCurrencyContract(token instanceof String ? token : token.address)

      if (!account || !token) {
        return
      }
      try {
        setBalance(formatUnits(await currencyContract?.balanceOf(account), await currencyContract?.decimals()))
      } catch (e) {
        console.log(e)
      }
    },
    [account, getCurrencyContract]
  )

  useEffect(() => {
    fetchTokenBalance(token)
  }, [fetchTokenBalance, token, useBlockNumber()]) //eslint-disable-line

  return balance
}
