import { Token } from '@halodao/sdk'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { useActiveWeb3React } from 'hooks'
import { getContract } from 'utils'
import { consoleLog } from 'utils/simpleLogger'
import ERC20ABI from '../../constants/abis/erc20.json'

const useToken = () => {
  const { chainId, account, library } = useActiveWeb3React()

  const addressToToken = async (tokenAddress: string) => {
    if (!chainId || !library) return null

    const ERC20Contract = getContract(tokenAddress, ERC20ABI, library)
    const [decimals, symbol, name] = await Promise.all([
      ERC20Contract.decimals(),
      ERC20Contract.symbol(),
      ERC20Contract.name()
    ])

    return new Token(chainId, tokenAddress, decimals, symbol, name)
  }

  const addressesToTokens = async (tokenAddresses: string[]) => {
    const tokensOrNulls = await Promise.all(tokenAddresses.map(addressToToken))
    return (tokensOrNulls as unknown[]).filter(token => token !== null) as Token[]
  }

  const allowTokenAmount = async (tokenAddress: string, amount: string, spender: string) => {
    if (!account || !library) return false
    const ERC20Contract = getContract(tokenAddress, ERC20ABI, library, account)

    const allowance = await ERC20Contract.allowance(account, spender)
    consoleLog(`[useSwap] Current token allowance: `, formatEther(allowance))
    const amountBN = parseEther(amount)
    consoleLog(`[useSwap] Amount to spend: `, formatEther(amountBN))
    if (allowance.gte(amountBN)) return true

    consoleLog(`[useSwap] Approving...`)
    const tx = await ERC20Contract.approve(spender, amountBN)
    await tx.wait()
    return true
  }

  return {
    addressToToken,
    addressesToTokens,
    allowTokenAmount
  }
}

export default useToken
