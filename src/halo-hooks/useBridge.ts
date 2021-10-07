import { useCallback, useState, useEffect } from 'react'
import { Contract, ethers } from 'ethers'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'
import { ChainId } from '@sushiswap/sdk'
import PRIMARY_BRIDGE_ABI from 'constants/haloAbis/PrimaryBridge.json'
import SECONDARY_BRIDGE_ABI from 'constants/haloAbis/SecondaryBridge.json'
import TOKEN_ABI from 'constants/abis/erc20.json'
import { getContract } from 'utils'
import { BRIDGE_CONTRACTS, ORIGINAL_TOKEN_CHAIN_ID, ORIGINAL_TOKEN_CHAIN_ADDRESS } from 'constants/bridge'
import { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import { toNumber } from 'utils/formatNumber'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { GetPriceBy, getTokensUSDPrice } from 'utils/coingecko'
import ReactGA from 'react-ga'
import { ButtonState } from '../constants/buttonStates'
import { getGasRangeEstimation, GasModes, GasModeRangeData } from 'utils/ethGasEstimator'
import { HALO, MOCK_TOKEN } from '../constants'

interface BridgeProps {
  setButtonState: (buttonState: ButtonState) => void
  setApproveState: (approveState: ApproveButtonState) => void
}

const useBridge = ({ setButtonState, setApproveState }: BridgeProps) => {
  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  const [tokenContract, setTokenContract] = useState<Contract | null>(null)
  const [destinationChainId, setDestinationChainId] = useState(ChainId.MATIC)
  const [primaryBridgeContract, setPrimaryBridgeContract] = useState<Contract | null>(null)
  const [secondaryBridgeContract, setSecondaryBridgeContract] = useState<Contract | null>(null)
  const [allowance, setAllowance] = useState(0)
  const [balance, setBalance] = useState(0)
  const [estimatedGas, setEstimatedGas] = useState('')
  const [successHash, setSuccessHash] = useState('')

  const [chainToken, setChainToken] = useState<any>(process.env.REACT_APP_MOCK_TOKEN_MAINNET ? MOCK_TOKEN : HALO)

  useEffect(() => {
    if (!chainId || !library) return

    const selectedToken = chainToken[chainId as ChainId]

    setTokenContract(getContract(selectedToken.address, TOKEN_ABI, library, account as string))
    setPrimaryBridgeContract(
      getContract(BRIDGE_CONTRACTS[selectedToken.address] as string, PRIMARY_BRIDGE_ABI, library, account as string)
    )
    if (ORIGINAL_TOKEN_CHAIN_ID[selectedToken.address] !== chainId) {
      setSecondaryBridgeContract(
        getContract(BRIDGE_CONTRACTS[selectedToken.address] as string, SECONDARY_BRIDGE_ABI, library, account as string)
      )
    }
  }, [chainToken]) // eslint-disable-line

  useEffect(() => {
    if (!chainId || !library) return

    const selectedToken = chainToken[chainId as ChainId]
    const bridgeContract = BRIDGE_CONTRACTS[selectedToken.address] as string
    setPrimaryBridgeContract(getContract(bridgeContract, PRIMARY_BRIDGE_ABI, library, account as string))
    if (ORIGINAL_TOKEN_CHAIN_ID[selectedToken.address] !== chainId) {
      setSecondaryBridgeContract(getContract(bridgeContract, SECONDARY_BRIDGE_ABI, library, account as string))
      setDestinationChainId(ORIGINAL_TOKEN_CHAIN_ID[selectedToken.address])
    } else {
      /** @dev Mock to BSC for now */
      setDestinationChainId(ChainId.MATIC)
    }
    setTokenContract(getContract(selectedToken.address, TOKEN_ABI, library, account as string))
    setButtonState(ButtonState.EnterAmount)
    setApproveState(ApproveButtonState.NotApproved)
  }, [chainId]) // eslint-disable-line

  useEffect(() => {
    if (!chainId || !destinationChainId || !library || !chainToken) return

    const selectedToken = chainToken[chainId as ChainId]

    if (ORIGINAL_TOKEN_CHAIN_ID[selectedToken.address] !== destinationChainId) {
      setSecondaryBridgeContract(
        getContract(BRIDGE_CONTRACTS[selectedToken.address] as string, SECONDARY_BRIDGE_ABI, library, account as string)
      )
    }
  }, [destinationChainId]) // eslint-disable-line

  const giveBridgeAllowance = useCallback(
    async (amount: ethers.BigNumber) => {
      if (!setApproveState || !setButtonState) return
      try {
        const tx = await tokenContract?.approve(primaryBridgeContract?.address, amount)
        addTransaction(tx, { summary: 'Give bridge allowance' })
        return tx
      } catch (e) {
        console.error(e)
        setApproveState(ApproveButtonState.NotApproved)
        setButtonState(ButtonState.Default)
      }
    },
    [addTransaction, tokenContract, primaryBridgeContract, setApproveState, setButtonState]
  )

  const estimateDeposit = useCallback(
    async (chainIdDestination: number, inputValue: string) => {
      const estimatedGas = await primaryBridgeContract?.estimateGas.deposit(parseEther(inputValue), chainIdDestination)
      setEstimatedGas(formatEther(estimatedGas as ethers.BigNumber))
    },
    [primaryBridgeContract]
  )

  const depositToPrimaryBridge = useCallback(
    async (amount: ethers.BigNumber, chainIdDestination: number) => {
      try {
        console.log('chainIdDestination', chainIdDestination)
        const tx = await primaryBridgeContract?.deposit(amount, chainIdDestination)
        addTransaction(tx, { summary: 'Deposit on bridge' })
        setSuccessHash(tx.hash)
        return tx
      } catch (e) {
        console.error(e)
        setApproveState(ApproveButtonState.Approved)
        setButtonState(ButtonState.Retry)
      }
    },
    [addTransaction, primaryBridgeContract, setApproveState, setButtonState]
  )

  const giveSecondaryBridgeAllowance = useCallback(
    async (amount: ethers.BigNumber) => {
      try {
        const tx = await tokenContract?.approve(secondaryBridgeContract?.address, amount)
        addTransaction(tx, { summary: 'Give bridge allowance' })
        return tx
      } catch (e) {
        console.error(e)
        setApproveState(ApproveButtonState.NotApproved)
        setButtonState(ButtonState.Default)
      }
    },
    [addTransaction, tokenContract, secondaryBridgeContract, setApproveState, setButtonState]
  )

  const estimateBurnWrappedToken = useCallback(
    async (inputValue: string) => {
      const estimatedGas = await secondaryBridgeContract?.estimateGas.burn(parseEther(inputValue))
      setEstimatedGas(formatEther(estimatedGas as ethers.BigNumber))
    },
    [secondaryBridgeContract]
  )

  const burnWrappedTokens = useCallback(
    async (amount: ethers.BigNumber) => {
      try {
        const tx = await secondaryBridgeContract?.burn(amount)
        addTransaction(tx, { summary: 'Burn wrapped tokens' })
        setSuccessHash(tx.hash)
        return tx
      } catch (e) {
        console.error(e)
        setApproveState(ApproveButtonState.Approved)
        setButtonState(ButtonState.Retry)
      }
    },
    [addTransaction, secondaryBridgeContract, setApproveState, setButtonState]
  )

  const approveAllowance = async (amount: ethers.BigNumber) => {
    setApproveState(ApproveButtonState.Approving)
    try {
      let tx
      if (chainToken && ORIGINAL_TOKEN_CHAIN_ID[chainToken.address] !== chainId) {
        tx = await giveSecondaryBridgeAllowance(amount)
      } else {
        tx = await giveBridgeAllowance(amount)
      }
      await tx.wait()
      setApproveState(ApproveButtonState.Approved)
      setButtonState(ButtonState.Next)
      setAllowance(toNumber(amount))
    } catch (e) {
      console.error(e)
    }
  }

  const fetchAllowance = useCallback(async () => {
    try {
      if (chainToken && chainId === ORIGINAL_TOKEN_CHAIN_ID[chainToken.address]) {
        setAllowance(
          await tokenContract?.allowance(account, primaryBridgeContract?.address).then((n: any) => toNumber(n))
        )
      } else {
        setAllowance(
          await tokenContract?.allowance(account, secondaryBridgeContract?.address).then((n: any) => toNumber(n))
        )
      }
    } catch (e) {
      console.error(e)
    }
  }, [tokenContract, account, chainId, primaryBridgeContract, secondaryBridgeContract, chainToken])

  const fetchBalance = useCallback(async () => {
    try {
      setBalance(await tokenContract?.balanceOf(account).then((n: any) => toNumber(n)))
    } catch (e) {
      console.error(e)
    }
  }, [tokenContract, account])

  useEffect(() => {
    if (account && primaryBridgeContract && secondaryBridgeContract && chainToken) {
      fetchAllowance()
      fetchBalance()
    }

    const refreshInterval = setInterval(() => {
      fetchAllowance()
      fetchBalance()
    }, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, fetchAllowance, fetchBalance, chainToken, allowance, primaryBridgeContract, secondaryBridgeContract])

  const deposit = async (amount: ethers.BigNumber, chainId: number): Promise<boolean> => {
    setButtonState(ButtonState.Confirming)
    try {
      const tx = await depositToPrimaryBridge(amount, chainId)
      await tx.wait()
      setApproveState(ApproveButtonState.NotApproved)
      setButtonState(ButtonState.Default)
      setAllowance(allowance - toNumber(amount))
    } catch (e) {
      console.error(e)
      return false
    }

    /** Log deposit to google analytics */
    ReactGA.event({
      category: 'Bridge',
      action: 'deposit',
      label: chainToken ? chainToken.symbol : '',
      value: parseFloat(formatEther(parseEther(amount.toString()).toString()))
    })

    return true
  }

  const burn = async (amount: ethers.BigNumber): Promise<boolean> => {
    setButtonState(ButtonState.Confirming)
    try {
      const tx = await burnWrappedTokens(amount)
      await tx.wait()
      setApproveState(ApproveButtonState.NotApproved)
      setButtonState(ButtonState.Default)
      setAllowance(allowance - toNumber(amount))
    } catch (e) {
      console.error(e)
      return false
    }

    /** log burn to google analytics */
    const targetToken = chainToken[destinationChainId]
    ReactGA.event({
      category: 'Bridge',
      action: 'burn',
      label: targetToken ? targetToken.symbol : '',
      value: parseFloat(formatEther(parseEther(amount.toString()).toString()))
    })

    return true
  }

  return {
    giveBridgeAllowance,
    estimateDeposit,
    depositToPrimaryBridge,
    giveSecondaryBridgeAllowance,
    estimateBurnWrappedToken,
    burnWrappedTokens,
    approveAllowance,
    fetchAllowance,
    deposit,
    burn,
    allowance,
    tokenContract,
    destinationChainId,
    setDestinationChainId,
    primaryBridgeContract,
    secondaryBridgeContract,
    balance,
    estimatedGas,
    successHash,
    chainToken,
    setChainToken
  }
}

export const useShuttleFee = (tokenAddress: string, destinationChainId: ChainId) => {
  const [lowerBoundFee, setLowerBoundFee] = useState(0)
  const [upperBoundFee, setUpperBoundFee] = useState(0)

  const getFee = useCallback(async () => {
    const originalTokenAddress = ORIGINAL_TOKEN_CHAIN_ADDRESS[tokenAddress] as string
    const tokenUSDPrice = await getTokensUSDPrice(GetPriceBy.address, [originalTokenAddress])

    let estimatedGasRange: GasModeRangeData

    switch (destinationChainId) {
      case ChainId.MAINNET:
        estimatedGasRange = await getGasRangeEstimation(GasModes.fast, GasModes.instant)
        break
      case ChainId.MATIC:
        estimatedGasRange = {
          floor: { usd: Number(process.env.REACT_APP_MATIC_FLOOR_FLAT_FEE) },
          ceiling: { usd: Number(process.env.REACT_APP_MATIC_CEILING_FLAT_FEE) }
        }
        break
      case ChainId.XDAI:
        estimatedGasRange = {
          floor: { usd: Number(process.env.REACT_APP_MATIC_FLOOR_FLAT_FEE) },
          ceiling: { usd: Number(process.env.REACT_APP_MATIC_CEILING_FLAT_FEE) }
        }
        break
      default:
        throw new Error('Invalid destination chain.')
    }
    const tokensPerUSD = 1 / tokenUSDPrice[originalTokenAddress]
    const floorFeeInToken = estimatedGasRange.floor.usd * tokensPerUSD
    const ceilingFeeInToken = estimatedGasRange.ceiling.usd * tokensPerUSD

    setLowerBoundFee(floorFeeInToken)
    setUpperBoundFee(ceilingFeeInToken)
  }, [tokenAddress, destinationChainId])

  return { lowerBoundFee, upperBoundFee, getFee }
}

export const useMinimumAmount = (tokenAddress: string) => {
  const [minimum, setMinimum] = useState(0)

  const getMinimum = useCallback(async () => {
    const originalTokenAddress = ORIGINAL_TOKEN_CHAIN_ADDRESS[tokenAddress] as string
    const prices = await getTokensUSDPrice(GetPriceBy.address, [originalTokenAddress])
    const flatFee = Number(process.env.REACT_APP_BRIDGE_MINIMUM_AMOUNT_USD) / prices[originalTokenAddress]
    setMinimum(Number(flatFee.toFixed(2)))
  }, [tokenAddress])

  return { minimum, getMinimum }
}

export default useBridge
