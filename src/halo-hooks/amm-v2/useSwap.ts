import { Token } from '@halodao/sdk'
import { useEffect } from 'react'
import useBalancerSDK from './useBalancerSDK'
import VaultABI from '../../constants/haloAbis/Vault.json'
import { useActiveWeb3React } from 'hooks'
import { SwapTypes } from '@balancer-labs/sdk'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import useHaloAddresses from 'halo-hooks/useHaloAddresses'
import { useContract } from 'hooks/useContract'
import { consoleLog } from 'utils/simpleLogger'

const useSwap = () => {
  const { account } = useActiveWeb3React()
  const balancer = useBalancerSDK()
  const haloAddresses = useHaloAddresses()
  const vaultContract = useContract(haloAddresses.ammV2.vault, VaultABI)

  useEffect(() => {
    if (!balancer) return

    consoleLog('[BalancerSDK] Fetching pools...')
    try {
      balancer.sor
        .fetchPools()
        .then(success => {
          consoleLog('[BalancerSDK] Pools fetched', success ? 'successfully' : 'with errors')
          return balancer.sor.getPools()
          // @todo: what else todo after fetching balancer pools?
        })
        .then(pools => {
          consoleLog('[BalancerSDK] Pools: ', pools)
        })
    } catch (e) {
      console.error('[BalancerSDK] Error fetching pools')
      console.error(e)
    }
  }, [balancer])

  const getSwaps = async (amount: string, swapType: SwapTypes, tokenIn: Token, tokenOut: Token) => {
    const decimals = swapType === SwapTypes.SwapExactIn ? tokenIn.decimals : tokenOut.decimals
    return [
      {
        poolId: '0x4b4404e80bb3ae9e342b8ac3a95ef014ae7f9e480001000000000000000000eb',
        assetInIndex: 0,
        assetOutIndex: 1,
        amount: parseUnits(amount === '' ? '0' : amount, decimals),
        userData: '0x'
      }
    ]
  }

  const previewSwap = async (amount: string, swapType: SwapTypes, tokenIn: Token, tokenOut: Token) => {
    if (!account || !vaultContract) return ['0', '0']

    const swaps = await getSwaps(amount, swapType, tokenIn, tokenOut)

    const tokenAddresses = [tokenIn.address, tokenOut.address]

    const funds = {
      sender: account,
      recipient: account,
      fromInternalBalance: false,
      toInternalBalance: false
    }

    consoleLog('[useSwap] queryBatchSwap params: ', swapType, swaps, tokenAddresses, funds)
    const deltas = await vaultContract.queryBatchSwap(swapType, swaps, tokenAddresses, funds)
    consoleLog(
      '[useSwap] queryBatchSwap response: ',
      formatUnits(deltas[0], tokenIn.decimals),
      formatUnits(deltas[1], tokenOut.decimals)
    )

    return [formatUnits(deltas[0], tokenIn.decimals), formatUnits(deltas[1], tokenOut.decimals)]
  }

  return {
    balancer,
    previewSwap
  }
}

export default useSwap
