import { useCallback } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useContract } from 'hooks/useContract'
import CURVE_ABI from 'constants/haloAbis/Curve.json'
import ASSIMILATOR_ABI from 'constants/haloAbis/Assimilator.json'
import { formatEther } from 'ethers/lib/utils'
import { ERC20_ABI } from 'constants/abis/erc20'
import { getContract } from 'utils'
import { Token } from '@sushiswap/sdk'

export const usePoolLiquidity = (address: string) => {
  const { account, library, chainId } = useActiveWeb3React()

  const CurveContract = useContract(address, CURVE_ABI, true)

  const getTokens = useCallback(async () => {
    if (!library || !chainId) {
      return []
    }

    const token0Address = await CurveContract?.derivatives(0)
    const token1Address = await CurveContract?.derivatives(1)
    console.log('Curve.derivatives(0):', token0Address)
    console.log('Curve.derivatives(1):', token1Address)
    const Token0Contract = getContract(token0Address, ERC20_ABI, library)
    const Token1Contract = getContract(token1Address, ERC20_ABI, library)
    const token0Symbol = await Token0Contract?.symbol()
    const token1Symbol = await Token1Contract?.symbol()
    console.log('Token0Contract.symbol():', token0Symbol)
    console.log('Token1Contract.symbol(1):', token1Symbol)
    const token0Decimals = await Token0Contract?.decimals()
    const token1Decimals = await Token1Contract?.decimals()
    console.log('Token0Contract.decimals():', token0Decimals)
    console.log('Token1Contract.decimals(1):', token1Decimals)

    return [
      new Token(chainId, token0Address, token0Decimals, token0Symbol, token0Symbol),
      new Token(chainId, token1Address, token1Decimals, token1Symbol, token1Symbol)
    ]
  }, [CurveContract, chainId])

  const getLiquidity = useCallback(async () => {
    if (!library) {
      return { total: 0, tokens: [0, 0] }
    }

    const res = await CurveContract?.liquidity()
    console.log(`Curve.liquidity(): `, res)
    console.log('Total value:', formatEther(res.total_))
    console.log('Total token[0] value:', formatEther(res.individual_[0]))
    console.log('Total token[1] value:', formatEther(res.individual_[1]))

    const derivatives0 = await CurveContract?.derivatives(0)
    const derivatives1 = await CurveContract?.derivatives(1)
    const assimialtor0Address = await CurveContract?.assimilator(derivatives0)
    const assimialtor1Address = await CurveContract?.assimilator(derivatives1)
    const Assimilator0Contract = getContract(assimialtor0Address, ASSIMILATOR_ABI, library)
    const Assimilator1Contract = getContract(assimialtor1Address, ASSIMILATOR_ABI, library)
    const rate0 = await Assimilator0Contract.getRate()
    const rate1 = await Assimilator1Contract.getRate()

    const eurNumeraire = res.individual_[0]
    const eurValue = eurNumeraire.mul(1e8).div(rate0)
    console.log('eurNumeraire:', formatEther(eurNumeraire))
    console.log('rate0:', formatEther(rate0))
    console.log('eurValue:', formatEther(eurValue))

    const usdcNumeraire = res.individual_[1]
    const usdcValue = usdcNumeraire.mul(1e8).div(rate1)
    console.log('usdcNumeraire:', formatEther(usdcNumeraire))
    console.log('rate1:', formatEther(rate1))
    console.log('usdcValue:', formatEther(usdcValue))

    return {
      total: res.total_,
      tokens: [eurValue, usdcValue]
    }
  }, [CurveContract, library])

  const getBalance = useCallback(async () => {
    const res = await CurveContract?.balanceOf(account)
    console.log(`Curve.balanceOf(${account}): `, res)
    return res
  }, [CurveContract, account])

  return { getTokens, getLiquidity, getBalance }
}
