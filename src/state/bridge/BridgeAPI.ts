export const retrieveBridgeContract = async (tokenAddress: string, chainId: number) => {
  const searchParams = new URLSearchParams(JSON.stringify({ tokenAddress, chainId })).toString()
  console.log('BRIDGE_API_BASE_URL:', process.env.BRIDGE_API_BASE_URL)
  // const url = `${process.env.BRIDGE_API_BASE_URL}/bridge-contracts`
  const url = `https://dev.halo-bridge.io/bridge-contracts/${tokenAddress}/${chainId}`
  console.log('url:', url)
  return fetch(url).then(async response => {
    if (response.status === 200) {
      return response.json()
    } else {
      throw new Error('Fetch was unsucessful.')
    }
  })
}
