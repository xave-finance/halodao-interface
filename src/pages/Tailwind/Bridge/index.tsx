import React, { useEffect, useState, useCallback, useMemo } from 'react'
import ethers from 'ethers'
import { ChainId, Currency } from '@sushiswap/sdk'
import { MOCK } from '../../../constants'
import { useWeb3React } from '@web3-react/core'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import InfoCard from 'components/Tailwind/Cards/InfoCard'
import SwitchButton from 'components/Tailwind/Buttons/SwitchButton'
import ConnectButton from 'components/Tailwind/Buttons/ConnectButton'
import SelectedNetworkPanel from 'components/Tailwind/Panels/SelectedNetworkPanel'
import WarningAlert from 'components/Tailwind/Alerts/WarningAlert'
import { useWalletModalToggle } from 'state/application/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { getContract, shortenAddress } from 'utils'

import { Contract } from '@ethersproject/contracts'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import { NetworkModalMode } from 'components/Tailwind/Modals/NetworkModal'
import RetryButton from 'components/Tailwind/Buttons/RetryButton'
import BridgeTransactionModal from './modals/BridgeTransactionModal'
import { BRIDGE_CONTRACTS, ORIGINAL_TOKEN_CHAIN_ID } from 'constants/bridge'
import PRIMARY_BRIDGE_ABI from 'constants/bridgeAbis/PrimaryBridge.json'
import SECONDARY_BRIDGE_ABI from 'constants/bridgeAbis/SecondaryBridge.json'
import TOKEN_ABI from 'constants/abis/erc20.json'
import { useTransactionAdder } from 'state/transactions/hooks'
import { toNumber } from 'utils/formatNumber'

export enum ButtonState {
  Default,
  EnterAmount,
  Approving,
  Approved,
  Next,
  Confirming,
  InsufficientBalance,
  Retry
}

const Bridge = () => {
  const addTransaction = useTransactionAdder()
  const { account, error, chainId, library } = useWeb3React()
  const [inputValue, setInputValue] = useState('')
  const [approveState, setApproveState] = useState(ApproveButtonState.NotApproved)
  const [showModal, setShowModal] = useState(false)
  const [buttonState, setButtonState] = useState(ButtonState.EnterAmount)

  const [token, setToken] = useState<any>(MOCK)
  const [tokenContract, setTokenContract] = useState<Contract | null>(null)
  const [destinationChainId, setDestinationChainId] = useState(100)
  const [primaryBridgeContract, setPrimaryBridgeContract] = useState<Contract | null>(null)
  const [secondaryBridgeContract, setSecondaryBridgeContract] = useState<Contract | null>(null)
  const [allowance, setAllowance] = useState(0)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    setTokenContract(getContract(token[chainId as ChainId].address, TOKEN_ABI, library, account as string))
    setPrimaryBridgeContract(
      getContract(BRIDGE_CONTRACTS[token[chainId as ChainId].address], PRIMARY_BRIDGE_ABI, library, account as string)
    )
    if (ORIGINAL_TOKEN_CHAIN_ID[token[chainId as ChainId].address] !== chainId) {
      setSecondaryBridgeContract(
        getContract(
          BRIDGE_CONTRACTS[token[chainId as ChainId].address],
          SECONDARY_BRIDGE_ABI,
          library,
          account as string
        )
      )
    }
  }, [token])

  useEffect(() => {
    setPrimaryBridgeContract(
      getContract(BRIDGE_CONTRACTS[token[chainId as ChainId].address], PRIMARY_BRIDGE_ABI, library, account as string)
    )
    if (ORIGINAL_TOKEN_CHAIN_ID[token[chainId as ChainId].address] !== chainId) {
      setSecondaryBridgeContract(
        getContract(
          BRIDGE_CONTRACTS[token[chainId as ChainId].address],
          SECONDARY_BRIDGE_ABI,
          library,
          account as string
        )
      )
      setDestinationChainId(ORIGINAL_TOKEN_CHAIN_ID[token[chainId as ChainId].address])
    } else {
      /** @dev Mock to BSC for now */
      setDestinationChainId(ChainId.BSC)
    }
    setTokenContract(getContract(token[chainId as ChainId].address, TOKEN_ABI, library, account as string))
  }, [chainId])

  useEffect(() => {
    if (ORIGINAL_TOKEN_CHAIN_ID[token[chainId as ChainId].address] !== destinationChainId) {
      // setTokenContract(getContract(token[chainId as ChainId], TOKEN_ABI, library, account as string))
      setSecondaryBridgeContract(
        getContract(
          BRIDGE_CONTRACTS[token[chainId as ChainId].address],
          SECONDARY_BRIDGE_ABI,
          library,
          account as string
        )
      )
    }
  }, [destinationChainId])

  const setButtonStates = () => {
    if (allowance >= parseFloat(inputValue)) {
      setButtonState(ButtonState.Next)
      setApproveState(ApproveButtonState.Approved)
    } else if (parseFloat(inputValue) <= balance && Number(inputValue) > 0 && allowance < parseFloat(inputValue)) {
      setButtonState(ButtonState.Default)
      setApproveState(ApproveButtonState.NotApproved)
    } else if (parseFloat(inputValue) > balance && parseFloat(inputValue) > allowance) {
      setButtonState(ButtonState.InsufficientBalance)
    } else if (inputValue.trim() === '') {
      setButtonState(ButtonState.EnterAmount)
      setApproveState(ApproveButtonState.NotApproved)
    }
  }

  useEffect(() => {
    setButtonStates()
  }, [inputValue])

  const giveBridgeAllowance = useCallback(
    async (amount: ethers.BigNumber) => {
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
    [addTransaction, tokenContract, primaryBridgeContract]
  )

  const depositToPrimaryBridge = useCallback(
    async (amount: ethers.BigNumber, chainIdDestination: number) => {
      try {
        const tx = await primaryBridgeContract?.deposit(amount, chainIdDestination)
        addTransaction(tx, { summary: 'Deposit on bridge' })
        return tx
      } catch (e) {
        console.error(e)
        setApproveState(ApproveButtonState.Approved)
        setButtonState(ButtonState.Retry)
      }
    },
    [addTransaction, primaryBridgeContract]
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
    [addTransaction, tokenContract, secondaryBridgeContract]
  )

  const burnWrappedTokens = useCallback(
    async (amount: ethers.BigNumber) => {
      try {
        const tx = await secondaryBridgeContract?.burn(amount)
        addTransaction(tx, { summary: 'Burn wrapped tokens' })
        return tx
      } catch (e) {
        console.error(e)
        setApproveState(ApproveButtonState.Approved)
        setButtonState(ButtonState.Retry)
      }
    },
    [addTransaction, secondaryBridgeContract]
  )

  const approveAllowance = async (amount: ethers.BigNumber) => {
    setApproveState(ApproveButtonState.Approving)
    try {
      let tx
      if (ORIGINAL_TOKEN_CHAIN_ID[token[chainId as ChainId].address] !== chainId) {
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
    if (chainId === ORIGINAL_TOKEN_CHAIN_ID[token[chainId as ChainId].address]) {
      setAllowance(
        await tokenContract?.allowance(account, primaryBridgeContract?.address).then((n: any) => toNumber(n))
      )
    } else {
      setAllowance(
        await tokenContract?.allowance(account, secondaryBridgeContract?.address).then((n: any) => toNumber(n))
      )
    }
  }, [tokenContract])

  const fetchBalance = useCallback(async () => {
    setBalance(await tokenContract?.balanceOf(account).then((n: any) => toNumber(n)))
  }, [tokenContract])

  useEffect(() => {
    fetchAllowance()
    fetchBalance()
  }, [account, fetchAllowance])

  const deposit = async (amount: ethers.BigNumber, chainId: number) => {
    setButtonState(ButtonState.Confirming)
    try {
      const tx = await depositToPrimaryBridge(amount, chainId)
      await tx.wait()
      setApproveState(ApproveButtonState.NotApproved)
      setButtonState(ButtonState.Default)
      setAllowance(allowance - toNumber(amount))
    } catch (e) {
      console.error(e)
    }

    /** @todo Add logging to google analytics */
  }

  const burn = async (amount: ethers.BigNumber) => {
    setButtonState(ButtonState.Confirming)
    try {
      const tx = await burnWrappedTokens(amount)
      await tx.wait()
      setApproveState(ApproveButtonState.NotApproved)
      setButtonState(ButtonState.Default)
      setAllowance(allowance - toNumber(amount))
    } catch (e) {
      console.error(e)
    }

    /** @todo Add logging to google analytics */
  }

  const NotApproveContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton
            title="Approve"
            state={ApproveButtonState.NotApproved}
            onClick={() => approveAllowance(ethers.utils.parseEther(`${inputValue}`))}
          />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Next" state={PrimaryButtonState.Disabled} onClick={() => console.log('clicked')} />
        </div>
      </div>
    )
  }

  const NextContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Next"
          state={PrimaryButtonState.Enabled}
          onClick={() => {
            if (inputValue) {
              setButtonState(ButtonState.Confirming)
              setShowModal(true)
            }
          }}
        />
      </div>
    )
  }

  const ApprovingContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton
            title="Approving"
            state={ApproveButtonState.Approving}
            onClick={() => {
              console.log('clicked')
            }}
          />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Next" state={PrimaryButtonState.Disabled} onClick={() => console.log('clicked')} />
        </div>
      </div>
    )
  }

  const ApprovedContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton
            title="Approve"
            state={ApproveButtonState.Approved}
            onClick={() => {
              console.log('clicked')
            }}
          />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Next" state={PrimaryButtonState.Disabled} onClick={() => console.log('clicked')} />
        </div>
      </div>
    )
  }

  const ConfirmingContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Confirming"
          state={PrimaryButtonState.InProgress}
          onClick={() => console.log('clicked')}
        />
      </div>
    )
  }

  const EnterAmountContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Enter an amount"
          state={PrimaryButtonState.Disabled}
          onClick={() => console.log('clicked')}
        />
      </div>
    )
  }

  const InsufficientBalanceContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Insufficient Balance"
          state={PrimaryButtonState.Disabled}
          onClick={() => console.log('clicked')}
        />
      </div>
    )
  }

  const RetryContent = () => {
    return (
      <div className="mt-4">
        <RetryButton
          title="Retry"
          isEnabled={true}
          onClick={() => {
            setButtonStates()
          }}
        />
      </div>
    )
  }

  const CurrentButtonContent = () => {
    let content = <></>
    if (approveState === ApproveButtonState.NotApproved && buttonState === ButtonState.Default) {
      content = <NotApproveContent />
    }
    if (approveState === ApproveButtonState.Approving && buttonState === ButtonState.Default) {
      content = <ApprovingContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Default) {
      content = <ApprovedContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Next) {
      content = <NextContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Confirming) {
      content = <ConfirmingContent />
    }
    if (approveState === ApproveButtonState.NotApproved && buttonState === ButtonState.EnterAmount) {
      content = <EnterAmountContent />
    }
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.Retry) {
      content = <RetryContent />
    }
    if (buttonState === ButtonState.InsufficientBalance) {
      content = <InsufficientBalanceContent />
    }
    return content
  }

  const MainContent = () => {
    const toggleWalletModal = useWalletModalToggle()

    if (!account && !error) {
      return (
        <div className="mt-2">
          <ConnectButton title="Connect to Wallet" onClick={() => toggleWalletModal()} />
        </div>
      )
    } else {
      return (
        <>
          <p className="mt-2 font-semibold text-secondary-alternate">Destination Address</p>
          <div className="mt-2">
            <p className="rounded-md p-2 w-full bg-primary-lightest"> {account && shortenAddress(account, 12)}</p>
          </div>
          <CurrentButtonContent />
        </>
      )
    }
  }

  return (
    <PageWrapper className="mb-8">
      <div className="md:float-left md:w-1/2">
        <PageHeaderLeft
          subtitle=""
          title="Bridge"
          caption="Move your ERC-20 token from EVM bridge to EVM bridge."
          link={{ text: 'Learn about bridge', url: 'https://docs.halodao.com' }}
        />
      </div>
      <div className="md:float-right md:w-1/2">
        <div className="flex items-start bg-white py-6 px-8 border border-primary-hover shadow-md rounded-card">
          <div className="w-full">
            <div className="flex md:space-x-4 mt-2">
              <div className="mb-2 w-2/5">
                <p className="text-secondary-alternate font-semibold">From</p>
              </div>
              <div className="mb-2 w-1/5"></div>
              <div className="mb-2 w-2/5">
                <p className="text-secondary-alternate font-semibold">To</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <SelectedNetworkPanel
                mode={NetworkModalMode.PrimaryBridge}
                chainId={chainId as ChainId}
                onChangeNetwork={() => console.log('hello')}
              />
              <div className="mb-2 w-1/5 flex items-center justify-center">
                <SwitchButton onClick={() => console.log('clicked')} />
              </div>
              <SelectedNetworkPanel
                mode={NetworkModalMode.SecondaryBridge}
                chainId={destinationChainId}
                onChangeNetwork={(chainId: number) => setDestinationChainId(chainId)}
                tokenAddress={token[chainId as ChainId].address}
              />
            </div>

            <p className="mt-2 font-semibold text-secondary-alternate">Amount</p>

            <div className="mt-2">
              <CurrencyInput
                currency={token[chainId as ChainId]}
                value={inputValue}
                canSelectToken={true}
                didChangeValue={val => setInputValue(val)}
                showBalance={true}
                showMax={true}
                onSelectToken={setToken}
              />
            </div>
            <MainContent />

            <div className="flex justify-center mt-2">
              <WarningAlert message="Don’t use exchange address for cross-chain transfers" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start md:w-1/2">
        <InfoCard
          title="Some Extra Info"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Parturient id vitae morbi ipsum est maecenas tellus at. Consequat in justo"
        />
      </div>
      <BridgeTransactionModal
        isVisible={showModal}
        currency={{ symbol: token[chainId as ChainId].symbol, decimals: 18 } as Currency}
        amount={inputValue}
        account={account}
        confirmLogic={async () => {
          if (ORIGINAL_TOKEN_CHAIN_ID[token[chainId as ChainId].address] !== chainId) {
            await burn(ethers.utils.parseEther(`${inputValue}`))
          } else {
            await deposit(ethers.utils.parseEther(`${inputValue}`), destinationChainId)
          }
        }}
        onDismiss={() => setShowModal(false)}
        originChainId={chainId as ChainId}
        destinationChainId={destinationChainId}
        tokenSymbol={token[chainId as ChainId].symbol}
        wrappedTokenSymbol={token[destinationChainId].symbol}
      />
    </PageWrapper>
  )
}

export default Bridge
