import React, { useEffect, useState } from 'react'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import SlippageTolerance from 'components/Tailwind/InputFields/SlippageTolerance'
import OnOffToggle from 'components/Tailwind/Toggle/OnOffToggle'
import { HelpCircle as QuestionIcon } from 'react-feather'
import PrimaryButton, { PrimaryButtonState } from 'components/Tailwind/Buttons/PrimaryButton'
import SpinnerIcon from 'assets/svg/spinner-icon-large.svg'
import ArrowIcon from 'assets/svg/arrow-up-icon-large.svg'
import { useAddRemoveLiquidity } from 'halo-hooks/amm/useAddRemoveLiquidity'
import { parseEther } from 'ethers/lib/utils'
import { formatNumber, NumberFormat } from 'utils/formatNumber'
import { getExplorerLink } from 'utils'
import { useActiveWeb3React } from 'hooks'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { useZap } from 'halo-hooks/amm/useZap'
import { useSwap } from 'halo-hooks/amm/useSwap'

enum SwapSettingsModalState {
  NotConfirmed,
  InProgress,
  Successful
}

interface SwapSettingsModalProps {
  isVisible: boolean
  onSlippageChanged: (slippage: string) => void
  onDismiss: () => void
}

const SwapSettingsModal = ({ isVisible, onSlippageChanged, onDismiss }: SwapSettingsModalProps) => {
  const { chainId } = useActiveWeb3React()
  const currentBlockTime = useCurrentBlockTimestamp()
  const [state, setState] = useState(SwapSettingsModalState.NotConfirmed)
  const [slippage, setSlippage] = useState('0.1')
  const [txHash, setTxHash] = useState('')
  const [tokenAmounts, setTokenAmounts] = useState([0, 0])
  const [tokenPrices, setTokenPrices] = useState([0, 0])
  const [lpAmount, setLpAmount] = useState({
    target: 0,
    min: 0
  })
  const [poolShare, setPoolShare] = useState(0)
  const [fromInputValue, setFromInputValue] = useState('')

  const dismissGracefully = () => {
    setState(SwapSettingsModalState.NotConfirmed)
    setTxHash('')
    onDismiss()
  }

  return (
    <BaseModal isVisible={isVisible} onDismiss={dismissGracefully}>
      <div className="p-4">
        <div className="font-semibold text-lg">Transaction settings</div>
        <div className="mt-4">
          <SlippageTolerance
            value={slippage}
            didChangeValue={(newSlippage: string) => {
              setSlippage(newSlippage)
              onSlippageChanged(newSlippage)
            }}
          />
        </div>
        <div className="mt-4 font-semibold text-lg">Interface settings</div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 mb-2">
            <span>Transaction deadline</span>
            <QuestionIcon size={16} />
          </div>
          <OnOffToggle didChangeValue={val => setFromInputValue(val)} />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 mb-2">
            <span>Disable Multihops</span>
            <QuestionIcon size={16} />
          </div>
          <OnOffToggle didChangeValue={val => setFromInputValue(val)} />
        </div>
      </div>
    </BaseModal>
  )
}

export default SwapSettingsModal
