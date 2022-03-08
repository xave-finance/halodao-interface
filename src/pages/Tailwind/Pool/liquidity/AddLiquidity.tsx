import React, { useEffect, useState } from 'react'
import { PoolData } from '../models/PoolData'
import { useTokenBalances } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import SegmentControl from 'components/Tailwind/SegmentControl/SegmentControl'
import MultiSidedLiquidity from './MultiSidedLiquidity'
import SingleSidedLiquidity from './SingleSidedLiquidity'
import AddLiquityModal from './AddLiquityModal'
import useErrorMessage, { ErrorMessageObject } from '../../../../halo-hooks/useErrorMessage'
import BaseModal from '../../../../components/Tailwind/Modals/BaseModal'
import ErrorContent from '../../../../components/Tailwind/ErrorContent/TransactionErrorContent'

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
  const [errors, setErrors] = useState<ErrorMessageObject>({ code: 0, data: '', message: '' })
  const [hasError, sethasError] = useState(false)
  const { message, getErrorMessage } = useErrorMessage()

  const { account } = useActiveWeb3React()
  const tokenBalances = useTokenBalances(account ?? undefined, [pool.token0, pool.token1])
  const balances = [tokenBalances[pool.token0.address], tokenBalances[pool.token1.address]]

  const disabledSegments = pool.pooled.total > 0 ? undefined : [1]
  const ErrorHandling = (errors: ErrorMessageObject) => {
    if (errors.code !== 0) {
      getErrorMessage(errors)
      sethasError(true)
    }
  }

  useEffect(() => {
    ErrorHandling(errors)
  }, [errors])

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
        ErrorStateSetter={setErrors}
      />
      {hasError && (
        <BaseModal
          isVisible={hasError}
          onDismiss={() => {
            sethasError(false)
          }}
        >
          {
            <ErrorContent
              objectError={errors}
              message={message}
              closeError={() => {
                sethasError(false)
              }}
            />
          }
        </BaseModal>
      )}
    </div>
  )
}

export default AddLiquidity
