import React, { useState } from 'react'
import { PoolData } from '../models/PoolData'
import { useActiveWeb3React } from 'hooks'
import SegmentControl from 'components/Tailwind/SegmentControl/SegmentControl'
import MultiSidedLiquidity from './MultiSidedLiquidity'
import SingleSidedLiquidity from './SingleSidedLiquidity'
import AddLiquityModal from './AddLiquityModal'
import ErrorModal from 'components/Tailwind/Modals/ErrorModal'
import useTokenBalance from 'sushi-hooks/queries/useTokenBalance'
import { TokenAmount } from '@halodao/sdk'

interface AddLiquidityProps {
  pool: PoolData
  isEnabled: boolean
}

const AddLiquidity = ({ pool, isEnabled }: AddLiquidityProps) => {
  const [activeSegment, setActiveSegment] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [baseAmount, setBaseAmount] = useState('')
  const [quoteAmount, setQuoteAmount] = useState('')
  const [zapAmount, setZapAmount] = useState('')
  const [isGivenBase, setIsGivenBase] = useState(true)
  const [slippage, setSlippage] = useState('3')
  const [error, setError] = useState<any>(undefined)

  const { account } = useActiveWeb3React()
  const token0Balance = useTokenBalance(pool.token0.address, account ?? undefined)
  const token1Balance = useTokenBalance(pool.token1.address, account ?? undefined)
  const balances = [
    new TokenAmount(pool.token0, BigInt(token0Balance.value.toString())),
    new TokenAmount(pool.token1, BigInt(token1Balance.value.toString()))
  ]

  const disabledSegments = pool.pooled.total > 0 ? undefined : [1]

  return (
    <div>
      <div className="flex items-center justify-end">
        {activeSegment === 1 && (
          <div className="italic text-xs text-gray-400 hidden mr-2 md:block">Swaps will be carried out for you</div>
        )}
        <SegmentControl
          segments={['Two-sided', 'Single-sided']}
          activeSegment={activeSegment}
          disabledSegments={disabledSegments}
          didChangeSegment={i => setActiveSegment(i)}
        />
      </div>

      {activeSegment === 0 ? (
        <MultiSidedLiquidity
          pool={pool}
          balances={balances}
          onBaseAmountChanged={setBaseAmount}
          onQuoteAmountChanged={setQuoteAmount}
          onDeposit={() => setShowModal(true)}
          onIsGivenBaseChanged={setIsGivenBase}
          isAddLiquidityEnabled={isEnabled}
        />
      ) : (
        <SingleSidedLiquidity
          pool={pool}
          balances={balances}
          onZapAmountChanged={setZapAmount}
          onIsGivenBaseChanged={setIsGivenBase}
          onSlippageChanged={setSlippage}
          onDeposit={() => setShowModal(true)}
          isAddLiquidityEnabled={isEnabled}
        />
      )}

      <AddLiquityModal
        isVisible={showModal}
        onDismiss={() => setShowModal(false)}
        pool={pool}
        baseAmount={baseAmount}
        quoteAmount={quoteAmount}
        zapAmount={zapAmount}
        slippage={slippage}
        isMultisided={activeSegment === 0}
        isGivenBase={isGivenBase}
        onError={setError}
      />
      {error && <ErrorModal isVisible={error !== undefined} onDismiss={() => setError(undefined)} error={error} />}
    </div>
  )
}

export default AddLiquidity
