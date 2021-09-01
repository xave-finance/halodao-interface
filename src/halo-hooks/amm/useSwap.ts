import { useCallback } from 'react'
import { useContract } from 'hooks/useContract'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import { PoolData } from 'pages/Tailwind/Pool/models/PoolData'
import { formatUnits, parseUnits } from 'ethers/lib/utils'

export const useSwap = (pool: PoolData) => {
  const CurveContract = useContract(pool.address, CURVE_ABI, true)

  const viewOriginSwap = useCallback(
    async (amount: string) => {
      const baseAmount = parseUnits(amount, pool.token0.decimals)
      const res = await CurveContract?.viewOriginSwap(pool.token0.address, pool.token1.address, baseAmount)
      console.log(`CurveContract?.viewOriginSwap(${baseAmount}): `, res)
      console.log('Target amount: ', formatUnits(res, pool.token1.decimals))
      return formatUnits(res, pool.token1.decimals)
    },
    [CurveContract, pool]
  )

  const viewTargetSwap = useCallback(
    async (amount: string) => {
      const quoteAmount = parseUnits(amount, pool.token1.decimals)
      const res = await CurveContract?.viewTargetSwap(pool.token0.address, pool.token1.address, quoteAmount)
      console.log(`CurveContract?.viewTargetSwap(${quoteAmount}): `, res)
      console.log('Origin amount: ', formatUnits(res, pool.token0.decimals))
      return formatUnits(res, pool.token0.decimals)
    },
    [CurveContract, pool]
  )

  return { viewOriginSwap, viewTargetSwap }
}
