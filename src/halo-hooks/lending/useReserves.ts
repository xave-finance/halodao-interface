import { useContract } from 'hooks/useContract'
import UI_POOL_DATA_PROVIDER_ABI from 'constants/haloAbis/UiPoolDataProvider.json'
import { useActiveWeb3React } from 'hooks'

export const useReserves = () => {
  const dataProviderAddress = '0x311382f1502645499628975a1ef1fc04fdd9331c'
  const addressesProviderAddress = '0x14b2081DEa87C26DC6F4FebEC5394f618387D27E'
  const UiPoolDataProviderContract = useContract(dataProviderAddress, UI_POOL_DATA_PROVIDER_ABI, true)
  const { account } = useActiveWeb3React()

  const fetchReserves = async () => {
    const {
      0: rawReservesData,
      1: userReserves,
      2: usdPriceEth,
      3: rawRewardsData
    } = await UiPoolDataProviderContract?.getReservesData(addressesProviderAddress, account ?? undefined)

    return {
      rawReservesData,
      userReserves,
      usdPriceEth,
      rawRewardsData
    }
  }

  return {
    fetchReserves
  }
}
