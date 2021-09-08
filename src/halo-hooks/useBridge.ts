import { useCallback, useState, useEffect } from 'react'
import { Contract, ethers } from 'ethers'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActiveWeb3React } from '../hooks'
import { ChainId } from '@sushiswap/sdk'
import PRIMARY_BRIDGE_ABI from 'constants/haloAbis/PrimaryBridge.json'
import SECONDARY_BRIDGE_ABI from 'constants/haloAbis/SecondaryBridge.json'
import TOKEN_ABI from 'constants/abis/erc20.json'
import { getContract } from 'utils'
import { BRIDGE_CONTRACTS, ORIGINAL_TOKEN_CHAIN_ID } from 'constants/bridge'
import { ButtonState } from 'pages/Tailwind/Bridge/BridgePanel'
import { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import { toNumber } from 'utils/formatNumber'
import { formatEther, parseEther } from 'ethers/lib/utils'
import ReactGA from 'react-ga'

interface BridgeProps {
  setButtonState: (buttonState: ButtonState) => void
  setApproveState: (approveState: ApproveButtonState) => void
  setInputValue: (input: string) => void
  chainToken: any
}

const useBridge = ({ setButtonState, setApproveState, setInputValue, chainToken }: BridgeProps) => {
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

  const onTokenChange = useCallback(() => {
    if (!chainId || !library) return
    setTokenContract(getContract(chainToken[chainId as ChainId].address, TOKEN_ABI, library, account as string))
    setPrimaryBridgeContract(
      getContract(
        BRIDGE_CONTRACTS[chainToken[chainId as ChainId]!.address],
        PRIMARY_BRIDGE_ABI,
        library,
        account as string
      )
    )
    if (ORIGINAL_TOKEN_CHAIN_ID[chainToken[chainId as ChainId].address] !== chainId) {
      setSecondaryBridgeContract(
        getContract(
          BRIDGE_CONTRACTS[chainToken[chainId as ChainId].address],
          SECONDARY_BRIDGE_ABI,
          library,
          account as string
        )
      )
    }
  }, [chainToken, account, chainId, library])

  useEffect(() => {
    onTokenChange()
  }, [chainToken, onTokenChange])

  const onChainIdChange = useCallback(() => {
    if (!chainId || !library || !setButtonState || !setInputValue || !setApproveState) return
    setPrimaryBridgeContract(
      getContract(
        BRIDGE_CONTRACTS[chainToken[chainId as ChainId].address],
        PRIMARY_BRIDGE_ABI,
        library,
        account as string
      )
    )
    if (ORIGINAL_TOKEN_CHAIN_ID[chainToken[chainId as ChainId]!.address] !== chainId) {
      setSecondaryBridgeContract(
        getContract(
          BRIDGE_CONTRACTS[chainToken[chainId as ChainId].address],
          SECONDARY_BRIDGE_ABI,
          library,
          account as string
        )
      )
      setDestinationChainId(ORIGINAL_TOKEN_CHAIN_ID[chainToken[chainId as ChainId]!.address])
    } else {
      /** @dev Mock to BSC for now */
      setDestinationChainId(ChainId.MATIC)
    }
    setTokenContract(getContract(chainToken[chainId as ChainId].address, TOKEN_ABI, library, account as string))

    setButtonState(ButtonState.EnterAmount)
    setApproveState(ApproveButtonState.NotApproved)
    setInputValue('')
  }, [chainId, chainToken, library, account, setApproveState, setButtonState, setInputValue])

  useEffect(() => {
    onChainIdChange()
  }, [onChainIdChange])

  const onDestinationChainIdChange = useCallback(() => {
    if (!chainId || !library) return
    if (ORIGINAL_TOKEN_CHAIN_ID[chainToken[chainId as ChainId].address] !== destinationChainId) {
      setSecondaryBridgeContract(
        getContract(
          BRIDGE_CONTRACTS[chainToken[chainId as ChainId].address],
          SECONDARY_BRIDGE_ABI,
          library,
          account as string
        )
      )
    }
  }, [chainId, chainToken, library, account, destinationChainId])

  useEffect(() => {
    onDestinationChainIdChange()
  }, [onDestinationChainIdChange])

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
      if (!setButtonState || !setApproveState) return
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
    if (!setApproveState || !setButtonState) return
    setApproveState(ApproveButtonState.Approving)
    try {
      let tx
      if (ORIGINAL_TOKEN_CHAIN_ID[chainToken[chainId as ChainId].address] !== chainId) {
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
    /** @todo Add logging to google analytics */
  }

  const fetchAllowance = useCallback(async () => {
    if (!chainId) return
    try {
      if (chainId === ORIGINAL_TOKEN_CHAIN_ID[chainToken[chainId as ChainId].address]) {
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
      setBalance(toNumber(await tokenContract?.balanceOf(account)))
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
    if (!setApproveState || !setButtonState) return false

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
      label: chainToken[chainId as ChainId]!.symbol,
      value: parseFloat(formatEther(parseEther(amount.toString()).toString()))
    })

    return true
  }

  const burn = async (amount: ethers.BigNumber): Promise<boolean> => {
    if (!setApproveState || !setButtonState) return false
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
    ReactGA.event({
      category: 'Bridge',
      action: 'burn',
      label: chainToken[destinationChainId]!.symbol,
      value: parseFloat(amount.toString())
    })

    return true
  }

  return {
    onTokenChange,
    onChainIdChange,
    onDestinationChainIdChange,
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
    successHash
  }
}

export default useBridge
