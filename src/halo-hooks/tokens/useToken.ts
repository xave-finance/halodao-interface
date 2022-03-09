import { Token } from '@halodao/sdk'
import { useActiveWeb3React } from 'hooks'
import { getContract } from 'utils'
import ERC20ABI from '../../constants/abis/erc20.json'

const useToken = () => {
  const { chainId, library } = useActiveWeb3React()

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

  return {
    addressToToken,
    addressesToTokens
  }
}

export default useToken
