import { ORACLE_ADDRESSES } from '../../constants'
import { useContract } from 'hooks/useContract'
import ORACLE_ABI from 'constants/haloAbis/Oracle.json'
import { useCallback, useMemo } from 'react'
import { useActiveWeb3React } from 'hooks'
import { ZERO_ADDRESS } from '../../constants'

export enum OracleCurrency {
  EURS,
  USDC,
  XSGD,
  CADC
}

export const useOracle = (currency: OracleCurrency) => {
  const { chainId } = useActiveWeb3React()

  const address = useMemo(() => {
    if (!chainId) return ZERO_ADDRESS
    switch (currency) {
      case OracleCurrency.EURS:
        return ORACLE_ADDRESSES.EURS[chainId]
      case OracleCurrency.USDC:
        return ORACLE_ADDRESSES.USDC[chainId]
      case OracleCurrency.XSGD:
        return ORACLE_ADDRESSES.XSGD[chainId]
      case OracleCurrency.CADC:
        return ORACLE_ADDRESSES.CADC[chainId]
    }
  }, [chainId, currency])

  const OracleContract = useContract(address, ORACLE_ABI, true)

  const getRate = useCallback(async () => {
    const res = await OracleContract?.latestRoundData()
    console.log('OracleContract.latestRoundData(): ', res)
    return res.answer
  }, [OracleContract])

  return { getRate }
}
