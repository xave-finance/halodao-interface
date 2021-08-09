import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ethers from 'ethers'
import { ChainId, Currency } from '@sushiswap/sdk'
import { HALO } from '../../../constants'
import { useWeb3React } from '@web3-react/core'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import InfoCard from 'components/Tailwind/Cards/InfoCard'
import SwitchButton from 'components/Tailwind/Buttons/SwitchButton'
import ConnectButton from 'components/Tailwind/Buttons/ConnectButton'
import SelectedNetworkPanel from 'components/Tailwind/Panels/SelectedNetworkPanel'
import WarningAlert from 'components/Tailwind/Alerts/WarningAlert'
import { useWalletModalToggle } from '../../../state/application/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { shortenAddress } from '../../../utils'
import { AppState, AppDispatch } from '../../../state'

import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import { NetworkModalMode } from 'components/Tailwind/Modals/NetworkModal'
import RetryButton from 'components/Tailwind/Buttons/RetryButton'
import BridgeTransactionModal from './modals/BridgeTransactionModal'

import { BridgeToken, MOCK_TOKEN } from 'constants/bridge'

import { getContract } from 'utils'
import PRIMARY_BRIDGE_ABI from 'constants/bridgeAbis/PrimaryBridge.json'
import SECONDARY_BRIDGE_ABI from 'constants/bridgeAbis/SecondaryBridge.json'
import TOKEN_ABI from 'constants/abis/erc20.json'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from 'hooks'

export enum ButtonState {
  Default,
  Next,
  Confirming,
  EnterAmount,
  InsufficientBalance,
  Retry
}

const Bridge = () => {
  const dispatch = useDispatch()
  const addTransaction = useTransactionAdder()
  const { account, error, chainId, library } = useWeb3React()
  // const { library, account, chainId } = useActiveWeb3React()
  const [inputValue, setInputValue] = useState('')
  const [approveState, setApproveState] = useState(ApproveButtonState.NotApproved)
  const [buttonState, setButtonState] = useState(ButtonState.EnterAmount)
  const [showModal, setShowModal] = useState(false)

  const [bridgeToken, setBridgeToken] = useState<BridgeToken>(MOCK_TOKEN)
  const [tokenContract, setTokenContract] = useState<any>(null)
  const [destinationChainId, setDestinationChainId] = useState(100)
  const [wrappedTokenContract, setWrappedTokenContract] = useState<any>(null)
  const [primaryBridgeContract, setPrimaryBridgeContract] = useState<any>(null)
  const [secondaryBridgeContract, setSecondaryBridgeContract] = useState<any>(null)

  useEffect(() => {
    setTokenContract(getContract(bridgeToken.tokenAddress, TOKEN_ABI, library, account as string))
    setPrimaryBridgeContract(
      getContract(bridgeToken.primaryBridgeContract, PRIMARY_BRIDGE_ABI, library, account as string)
    )
  }, [bridgeToken])

  useEffect(() => {
    setPrimaryBridgeContract(
      getContract(bridgeToken.primaryBridgeContract, PRIMARY_BRIDGE_ABI, library, account as string)
    )
    if (bridgeToken.chainId !== chainId) {
      setSecondaryBridgeContract(
        getContract(
          bridgeToken.secondaryBridgeContracts[destinationChainId as number],
          SECONDARY_BRIDGE_ABI,
          library,
          account as string
        )
      )
    }
  }, [chainId])

  useEffect(() => {
    console.log('bridgeToken.secondaryBridgeContracts:', bridgeToken.secondaryBridgeContracts)
    // setSecondaryBridgeContract(
    //   getContract(
    //     bridgeToken.secondaryBridgeContracts[destinationChainId as number],
    //     SECONDARY_BRIDGE_ABI,
    //     library,
    //     account as string
    //   )
    // )
    if (bridgeToken.chainId !== destinationChainId) {
      setWrappedTokenContract(
        getContract(bridgeToken.wrappedTokens[destinationChainId as number], TOKEN_ABI, library, account as string)
      )
    }
  }, [destinationChainId])

  const giveBridgeAllowance = useCallback(
    async (amount: ethers.BigNumber) => {
      try {
        const tx = await tokenContract?.approve(primaryBridgeContract?.address, amount)
        addTransaction(tx, { summary: 'Give primary bridge allowance' })
        return tx
      } catch (e) {
        throw new Error(e)
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
        throw new Error(e)
      }
    },
    [addTransaction, primaryBridgeContract]
  )

  const giveSecondaryBridgeAllowance = useCallback(
    async (amount: ethers.BigNumber) => {
      try {
        const tx = await wrappedTokenContract?.approve(secondaryBridgeContract?.address, amount)
        addTransaction(tx, { summary: 'Give bridge allowance' })
        return tx
      } catch (e) {
        throw new Error(e)
      }
    },
    [addTransaction, wrappedTokenContract, secondaryBridgeContract]
  )

  const burnWrappedTokens = useCallback(
    async (amount: ethers.BigNumber) => {
      try {
        const tx = await secondaryBridgeContract?.burn(amount)
        addTransaction(tx, { summary: 'Burn wrapped tokens' })
        return tx
      } catch (e) {
        throw new Error(e)
      }
    },
    [addTransaction, secondaryBridgeContract]
  )

  const approveAllowance = async (amount: ethers.BigNumber) => {
    setApproveState(ApproveButtonState.Approving)
    try {
      let tx
      console.log('chainId:', bridgeToken.chainId, ' chainId:', chainId)
      console.log('chainId === destinationChainId:', bridgeToken.chainId === chainId)
      if (bridgeToken.chainId !== chainId) {
        tx = await giveSecondaryBridgeAllowance(amount)
      } else {
        tx = await giveBridgeAllowance(amount)
      }
      await tx.wait()
      setApproveState(ApproveButtonState.Approved)
      setButtonState(ButtonState.Next)
    } catch (e) {
      console.error(e)
    }

    /** @todo Add logging to google analytics */
  }

  const deposit = async (amount: ethers.BigNumber, chainId: number) => {
    setButtonState(ButtonState.Confirming)
    try {
      const tx = await depositToPrimaryBridge(amount, chainId)
      await tx.wait()
      setApproveState(ApproveButtonState.NotApproved)
      setButtonState(ButtonState.Default)
    } catch (e) {
      console.error(e)
    }
  }

  const burn = async (amount: ethers.BigNumber) => {
    setButtonState(ButtonState.Confirming)
    try {
      const tx = await burnWrappedTokens(amount)
      await tx.wait()
      setApproveState(ApproveButtonState.NotApproved)
      setButtonState(ButtonState.Default)
    } catch (e) {
      console.error(e)
    }
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
        <RetryButton title="Retry" isEnabled={true} onClick={() => console.log('clicked')} />
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
    if (approveState === ApproveButtonState.Approved && buttonState === ButtonState.InsufficientBalance) {
      content = <InsufficientBalanceContent />
    }
    return <>{content}</>
  }

  const MainContent = () => {
    const toggleWalletModal = useWalletModalToggle()
    const balance = useCurrencyBalance(account ?? undefined, HALO[ChainId.MAINNET])

    if (!account && !error) {
      return (
        <div className="mt-2">
          <ConnectButton title="Connect to Wallet" onClick={() => toggleWalletModal()} />
        </div>
      )
    } else {
      return (
        <>
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
        <div className="flex items-start bg-white py-6 px-8 border border-primary-dark shadow-md rounded-card">
          <div className="w-full">
            <div className="flex md:space-x-4 mt-2">
              <div className="mb-2 w-2/5">
                <p className="text-secondary font-semibold">From</p>
              </div>
              <div className="mb-2 w-1/5"></div>
              <div className="mb-2 w-2/5">
                <p className="text-secondary font-semibold">To</p>
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
                destinationChainId={destinationChainId}
              />
            </div>

            <p className="mt-2 font-semibold text-secondary">Amount</p>

            <div className="mt-2">
              <CurrencyInput
                currency={HALO[ChainId.MAINNET]!}
                value={inputValue}
                canSelectToken={true}
                didChangeValue={val => setInputValue(val)}
                showBalance={true}
                showMax={true}
              />
            </div>

            <p className="mt-2 font-semibold text-secondary">Destination Address</p>
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
        currency={{ symbol: bridgeToken.tokenSymbol, decimals: 18 } as Currency}
        amount={inputValue}
        account={account}
        confirmLogic={async () => {
          if (bridgeToken.chainId !== chainId) {
            await burn(ethers.utils.parseEther(`${inputValue}`))
          } else {
            await deposit(ethers.utils.parseEther(`${inputValue}`), destinationChainId)
          }
        }}
        onDismiss={() => setShowModal(false)}
      />
    </PageWrapper>
  )
}

export default Bridge
