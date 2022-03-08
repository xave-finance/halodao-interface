import { useCallback } from 'react'
import { useContract } from 'hooks/useContract'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import { PoolData } from 'pages/Tailwind/Pool/models/PoolData'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { consoleLog } from 'utils/simpleLogger'

export const useSwap = (pool: PoolData) => {
  const CurveContract = useContract(pool.address, CURVE_ABI, true)
  const token0 = pool.tokens[0].token
  const token1 = pool.tokens[1].token

  const viewOriginSwap = useCallback(
    async (amount: string) => {
      const baseAmount = parseUnits(amount, token0.decimals)
      consoleLog('viewOriginSwap params: ', token0.address, token1.address, formatUnits(baseAmount, token0.decimals))
      const res = await CurveContract?.viewOriginSwap(token0.address, token1.address, baseAmount)
      consoleLog('viewOriginSwap result: ', formatUnits(res, token1.decimals))
      return formatUnits(res, token1.decimals)
    },
    [CurveContract, token0, token1]
  )

  const viewTargetSwap = useCallback(
    async (amount: string) => {
      const quoteAmount = parseUnits(amount, token1.decimals)
      consoleLog('viewTargetSwap params: ', token0.address, token1.address, formatUnits(quoteAmount, token1.decimals))
      const res = await CurveContract?.viewTargetSwap(token0.address, token1.address, quoteAmount)
      consoleLog('viewTargetSwap result: ', formatUnits(res, token1.decimals))
      return formatUnits(res, token0.decimals)
    },
    [CurveContract, token0, token1]
  )

  return { viewOriginSwap, viewTargetSwap }
}
