import { useCallback, useState, useEffect } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'
import { useContract, useTokenContract } from 'hooks/useContract'
import DUTCHAUCTION_ABI from '../constants/haloAbis/DutchAuction.json'
import { ethers } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { formatNumber } from 'utils/formatNumber'
import { BalanceProps } from 'sushi-hooks/queries/useTokenBalance'
import { AUCTION_ADDRESS, PAYMENT_AUCTION_ADDRESS } from '../constants'

const useMisoDutchAuction = () => {
  const { account, chainId } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const dutchAuctionContract = useContract(chainId ? AUCTION_ADDRESS[chainId] : undefined || '', DUTCHAUCTION_ABI)
  const paymentCurrency = useTokenContract(chainId ? PAYMENT_AUCTION_ADDRESS[chainId] : undefined || '') // withSigner
  const [allowance, setAllowance] = useState('0')
  const [endTime, setEndtime] = useState<string>()
  const [currentTokenPrice, setCurrentTokenPrice] = useState<string>()
  const [marketParticipationAgreement, setMarketParticipationAgreement] = useState<string>()
  const [userTokensClaimable, setUserTokensClaimable] = useState<string>()
  const [tokenAveragePrice, setAveragePrice] = useState<string>()

  const getAuctionDetails = useCallback(async () => {
    const marketInfo = await dutchAuctionContract?.marketInfo()
    const currentTokenPrice = await dutchAuctionContract?.priceFunction()
    const averagePrice = await dutchAuctionContract?.tokenPrice()
    const marketParticipationAgreement = await dutchAuctionContract?.marketParticipationAgreement()
    const auctionEndTime = new Date(Number(marketInfo.endTime) * 1000)
    const tokensClaimable = await dutchAuctionContract?.tokensClaimable(account)

    setEndtime(auctionEndTime.toString())
    setCurrentTokenPrice(formatNumber(+formatEther(currentTokenPrice)))
    setMarketParticipationAgreement(marketParticipationAgreement)
    setUserTokensClaimable(formatNumber(+formatEther(tokensClaimable)))
    setAveragePrice(formatNumber(+formatEther(averagePrice)))
  }, [dutchAuctionContract, account])

  const fetchAllowance = useCallback(async () => {
    if (account) {
      try {
        const allowance = await paymentCurrency?.allowance(account, dutchAuctionContract?.address)
        const formatted = formatEther(allowance)
        setAllowance(formatted)
      } catch {
        setAllowance('0')
      }
    }
  }, [account, paymentCurrency, dutchAuctionContract])

  useEffect(() => {
    if (account && dutchAuctionContract && paymentCurrency) {
      getAuctionDetails()
      fetchAllowance()
    }
    const refreshInterval = setInterval(() => {
      fetchAllowance()
      getAuctionDetails()
    }, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, dutchAuctionContract, paymentCurrency, getAuctionDetails, fetchAllowance])

  const commitTokens = useCallback(
    async (amount: BalanceProps) => {
      console.log(amount)
      try {
        const tx = await dutchAuctionContract?.commitTokens(amount.value, true)

        return addTransaction(tx, { summary: 'Commit tokens for HALO' })
      } catch (e) {
        return e
      }
    },
    [addTransaction, dutchAuctionContract]
  )

  const approve = useCallback(async () => {
    try {
      const tx = await paymentCurrency?.approve(dutchAuctionContract?.address, ethers.constants.MaxUint256.toString())
      return addTransaction(tx, { summary: 'Approve' })
    } catch (e) {
      return e
    }
  }, [addTransaction, paymentCurrency, dutchAuctionContract])

  return {
    endTime,
    currentTokenPrice,
    marketParticipationAgreement,
    allowance,
    userTokensClaimable,
    tokenAveragePrice,
    commitTokens,
    approve
  }
}

export default useMisoDutchAuction
