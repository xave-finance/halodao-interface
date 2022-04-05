import { Token } from '@halodao/sdk'
import { BigNumber } from 'ethers/lib/ethers'
import { defaultAbiCoder, formatUnits, parseUnits } from 'ethers/lib/utils'
import useHaloAddresses from 'halo-hooks/useHaloAddresses'
import useToken from 'halo-hooks/tokens/useToken'
import { useContract } from 'hooks/useContract'
import VaultABI from '../../constants/haloAbis/Vault.json'
import { useActiveWeb3React } from 'hooks'
import { consoleLog } from 'utils/simpleLogger'

const sortTokensAndAmounts = (tokens: Token[], amounts: string[]): [Token[], BigNumber[]] => {
  const tokenAmounts: { token: Token; amount: string }[] = []
  for (let i = 0; i < tokens.length; i++) {
    tokenAmounts.push({ token: tokens[i], amount: amounts[i] })
  }
  tokenAmounts.sort((a, b) => {
    return a.token.address.localeCompare(b.token.address)
  })
  return [tokenAmounts.map(t => t.token), tokenAmounts.map(t => parseUnits(t.amount, t.token.decimals))]
}

const usePoolInvest = (poolId: string, tokens: Token[]) => {
  const { account } = useActiveWeb3React()
  const haloAddresses = useHaloAddresses()
  const vaultContract = useContract(haloAddresses.ammV2.vault, VaultABI)
  const { allowTokenAmount } = useToken()

  const deposit = async (amounts: string[]) => {
    if (!vaultContract || !account) return

    const [sortedTokens, sortedAmounts] = sortTokensAndAmounts(tokens, amounts)

    await allowTokenAmount(
      sortedTokens[0].address,
      formatUnits(sortedAmounts[0], sortedTokens[0].decimals),
      vaultContract.address
    )
    await allowTokenAmount(
      sortedTokens[1].address,
      formatUnits(sortedAmounts[1], sortedTokens[1].decimals),
      vaultContract.address
    )

    const sortedAddresses = sortedTokens.map(t => t.address)
    const payload = defaultAbiCoder.encode(['uint256[]', 'address[]'], [sortedAmounts, sortedAddresses])

    const request = {
      assets: sortedAddresses,
      maxAmountsIn: sortedAmounts,
      userData: payload,
      fromInternalBalance: false
    }

    consoleLog('joinPool() request: ', request)
    consoleLog(
      'amounts: ',
      formatUnits(sortedAmounts[0], sortedTokens[0].decimals),
      formatUnits(sortedAmounts[1], sortedTokens[1].decimals)
    )

    return await vaultContract.joinPool(poolId, account, account, request)
  }

  const withdraw = async (lptAmount: BigNumber, tokenAmounts: string[]) => {
    if (!vaultContract || !account) return

    const [sortedTokens, sortedTokenAmounts] = sortTokensAndAmounts(tokens, tokenAmounts)

    const payload = defaultAbiCoder.encode(['uint256'], [lptAmount])

    const request = {
      assets: sortedTokens.map(t => t.address),
      minAmountsOut: sortedTokenAmounts,
      userData: payload,
      fromInternalBalance: false
    }

    return await vaultContract.exitPool(poolId, account, account, request)
  }

  return {
    deposit,
    withdraw
  }
}

export default usePoolInvest
