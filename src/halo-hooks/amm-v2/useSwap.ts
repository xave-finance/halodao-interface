import { Token } from '@halodao/sdk'
import { useEffect } from 'react'
import useBalancerSDK from './useBalancerSDK'
import VaultABI from '../../constants/haloAbis/Vault.json'
import { useActiveWeb3React } from 'hooks'
import { SwapTypes } from '@balancer-labs/sdk'
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils'
import useHaloAddresses from 'halo-hooks/useHaloAddresses'
import { useContract } from 'hooks/useContract'
import { consoleLog } from 'utils/simpleLogger'
import assert from 'assert'
import { BigNumber, ethers } from 'ethers'

const useSwap = () => {
  const { account } = useActiveWeb3React()
  const balancer = useBalancerSDK()
  const haloAddresses = useHaloAddresses()
  const vaultContract = useContract(haloAddresses.ammV2.vault, VaultABI)

  // useEffect(() => {
  //   if (!balancer) return

  //   consoleLog('[useSwap] Fetching balancer pools...')
  //   try {
  //     balancer.sor
  //       .fetchPools()
  //       .then(success => {
  //         consoleLog('[useSwap] Balancer pools fetched', success ? 'successfully' : 'with errors')
  //         return balancer.sor.getPools()
  //         // @todo: what else todo after fetching balancer pools?
  //       })
  //       .then(pools => {
  //         consoleLog('[useSwap] Balancer pools: ', pools)
  //       })
  //   } catch (e) {
  //     console.error('[useSwap] Error fetching balancer pools')
  //     console.error(e)
  //   }
  // }, [balancer])

  const getSwapsBalancer = async (amount: string, swapType: SwapTypes, tokenIn: Token, tokenOut: Token) => {
    if (!balancer) return

    const gasPrice = BigNumber.from('40000000000')
    const maxPools = 4

    const swapInfo = await balancer.sor.getSwaps(tokenIn.address, tokenOut.address, swapType, amount, {
      gasPrice,
      maxPools
    })

    return swapInfo.swaps
  }

  const getSwaps = async (amount: string, swapType: SwapTypes, tokenIn: Token, tokenOut: Token) => {
    const decimals = swapType === SwapTypes.SwapExactIn ? tokenIn.decimals : tokenOut.decimals
    const allPools = [...haloAddresses.ammV2.pools.genesis, ...haloAddresses.ammV2.pools.enabled]

    // scenario 1: there's a pool with both tokenIn and tokenOut
    const poolWithBothTokens = allPools.find(
      p => p.assets.includes(tokenIn.address) && p.assets.includes(tokenOut.address)
    )
    if (poolWithBothTokens) {
      consoleLog('token decimals: ', decimals)
      consoleLog('token amount: ', formatUnits(parseUnits(amount, decimals), decimals))
      const sortedTokenAddresses = [tokenIn.address.toLowerCase(), tokenOut.address.toLowerCase()].sort()
      consoleLog('sortedTokenAddresses: ', sortedTokenAddresses)

      return {
        tokenAddresses: sortedTokenAddresses,
        swaps: [
          {
            poolId: poolWithBothTokens.poolId,
            assetInIndex: sortedTokenAddresses.indexOf(tokenIn.address.toLowerCase()),
            assetOutIndex: sortedTokenAddresses.indexOf(tokenOut.address.toLowerCase()),
            amount: parseUnits(amount, decimals),
            userData: '0x'
          }
        ]
      }
    }

    // scenario 2: need to do 2 trades
    const poolWithTokenIn = allPools.find(p => p.assets.includes(tokenIn.address))
    const poolWithTokenOut = allPools.find(p => p.assets.includes(tokenOut.address))
    assert(poolWithTokenIn && poolWithTokenOut, 'Unable to find a swap route')

    const sortedTokenAddresses = [
      tokenIn.address.toLowerCase(),
      poolWithTokenIn.assets[1].toLowerCase(),
      tokenOut.address.toLowerCase()
    ].sort()
    consoleLog('sortedTokenAddresses: ', sortedTokenAddresses)

    let swaps = []
    if (swapType === SwapTypes.SwapExactIn) {
      swaps = [
        {
          poolId: poolWithTokenIn.poolId,
          assetInIndex: sortedTokenAddresses.indexOf(tokenIn.address.toLowerCase()),
          assetOutIndex: sortedTokenAddresses.indexOf(poolWithTokenIn.assets[1].toLowerCase()),
          amount: parseUnits(amount, decimals),
          userData: '0x'
        },
        {
          poolId: poolWithTokenOut.poolId,
          assetInIndex: sortedTokenAddresses.indexOf(poolWithTokenIn.assets[1].toLowerCase()),
          assetOutIndex: sortedTokenAddresses.indexOf(tokenOut.address.toLowerCase()),
          amount: parseUnits('0'),
          userData: '0x'
        }
      ]
    } else {
      swaps = [
        {
          poolId: poolWithTokenOut.poolId,
          assetInIndex: sortedTokenAddresses.indexOf(tokenOut.address.toLowerCase()),
          assetOutIndex: sortedTokenAddresses.indexOf(poolWithTokenOut.assets[1].toLowerCase()),
          amount: parseUnits(amount, decimals),
          userData: '0x'
        },
        {
          poolId: poolWithTokenIn.poolId,
          assetInIndex: sortedTokenAddresses.indexOf(poolWithTokenOut.assets[1].toLowerCase()),
          assetOutIndex: sortedTokenAddresses.indexOf(tokenIn.address.toLowerCase()),
          amount: parseUnits('0'),
          userData: '0x'
        }
      ]
    }

    return {
      tokenAddresses: sortedTokenAddresses,
      swaps
    }
  }

  const previewSwap = async (amount: string, swapType: SwapTypes, tokenIn: Token, tokenOut: Token) => {
    if (!account || !vaultContract || amount === '') return ['0', '0']

    const { tokenAddresses, swaps } = await getSwaps(amount, swapType, tokenIn, tokenOut)
    //const swaps = await getSwapsBalancer(amount, swapType, tokenIn, tokenOut)

    const funds = {
      sender: account,
      recipient: account,
      fromInternalBalance: false,
      toInternalBalance: false
    }

    consoleLog('[useSwap] queryBatchSwap params: ', swapType, swaps, tokenAddresses, funds)
    const deltas = await vaultContract.queryBatchSwap(swapType, swaps, tokenAddresses, funds)
    consoleLog('[useSwap] queryBatchSwap raw response: ', deltas.toString())
    consoleLog(
      '[useSwap] queryBatchSwap response: ',
      formatUnits(deltas[0], tokenIn.decimals),
      formatUnits(deltas[1], tokenOut.decimals)
    )

    const estimatedAmountIn = formatUnits(deltas[0], tokenIn.decimals).replace('-', '')
    const estimatedAmountOut = formatUnits(deltas[1], tokenOut.decimals).replace('-', '')

    return [estimatedAmountIn, estimatedAmountOut]
  }

  const swap = async (amount: string, swapType: SwapTypes, tokenIn: Token, tokenOut: Token) => {
    if (!account || !vaultContract || amount === '') return

    const { tokenAddresses, swaps } = await getSwaps(amount, swapType, tokenIn, tokenOut)
    //const swaps = await getSwapsBalancer(amount, swapType, tokenIn, tokenOut)

    const funds = {
      sender: account,
      recipient: account,
      fromInternalBalance: false,
      toInternalBalance: false
    }

    const limits = [parseUnits('999999999', 18), parseUnits('999999999', 6), parseUnits('999999999', 6)]

    const deadline = ethers.constants.MaxUint256

    consoleLog(
      '[useSwap] batchSwap params: ',
      swapType,
      swaps,
      tokenAddresses,
      funds,
      limits.toString(),
      deadline.toString()
    )
    const tx = await vaultContract.batchSwap(swapType, swaps, tokenAddresses, funds, limits, deadline)
    const deltas = await tx.wait()
    consoleLog('[useSwap] batchSwap raw response: ', deltas)
  }

  return {
    balancer,
    previewSwap,
    swap
  }
}

export default useSwap
