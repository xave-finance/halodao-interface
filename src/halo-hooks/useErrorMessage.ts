import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

export enum CurveError {
  curveReentered = 'Curve/re-entered',
  allowanceDecreaseUnderflow = 'Curve/allowance-decrease-underflow',
  approvalOverflow = 'Curve/approval-overflow',
  insufficientAllowance = 'Curve/insufficient-allowance',
  frozen = 'Curve/frozen-only-allowing-proportional-withdraw',
  emergencyState = 'Curve/emergency-only-allowing-emergency-proportional-withdraw',
  transactionDeadlinePassed = 'Curve/tx-deadline-passed',
  whitelistOnGoing = 'Curve/whitelist-stage-on-going',
  whitelistStopped = 'Curve/whitelist-stage-stopped',
  swapAmountTooLarge = 'Curve/amount-too-large',
  swapConvergenceFailed = 'Curve/swap-convergence-failed',
  swapInvariantViolation = 'Curve/swap-invariant-violation',
  liquidityInvariantViolation = 'Curve/liquidity-invariant-violation',
  upperHalt = 'Curve/upper-halt',
  lowerHalt = 'Curve/lower-halt',
  CADCTransferFailed = 'Curve/CADC-transfer-from-failed'
  // check the other failed
}

export type ErrorMessageObject = {
  code: number
  data: string
  message: string
}

const useErrorMessage = () => {
  const { t } = useTranslation()
  const [message, setMessage] = useState(t('curveDefaultErrorMessage'))

  const getErrorMessage = useCallback(
    (errorObject: ErrorMessageObject) => {
      switch (errorObject.message) {
        case CurveError.curveReentered:
          setMessage('curveDefaultErrorMessage')
          break
        case CurveError.allowanceDecreaseUnderflow:
          setMessage(t('curveAllowanceErrorMessage'))
          break
        case CurveError.approvalOverflow:
          setMessage(t('curveAllowanceErrorMessage'))
          break
        case CurveError.insufficientAllowance:
          setMessage(t('curveAllowanceErrorMessage'))
          break
        case CurveError.frozen:
          setMessage(t('curveFrozenMessage"'))
          break
        case CurveError.emergencyState:
          setMessage(t('curveEmergencyMessage'))
          break
        case CurveError.transactionDeadlinePassed:
          setMessage(t('curveDeadlinePassedMessage'))
          break
        case CurveError.whitelistOnGoing:
          setMessage(t('curveWhitelistingStageMessage'))
          break
        case CurveError.whitelistStopped:
          setMessage(t('curveNotWhitelistingStageMessage'))
          break
        case CurveError.swapAmountTooLarge:
          setMessage(t('curveAmountTooLargeErrorMessage'))
          break
        case CurveError.swapConvergenceFailed:
          setMessage(t('curveSwapFailedErrorMessage'))
          break
        case CurveError.swapInvariantViolation:
          setMessage(t('curveSwapFailedErrorMessage'))
          break
        case CurveError.liquidityInvariantViolation:
          setMessage(t('curveSwapFailedErrorMessage'))
          break
        case CurveError.upperHalt:
          setMessage(t('curveSwapHaltErrorMessage'))
          break
        case CurveError.lowerHalt:
          setMessage(t('curveSwapHaltErrorMessage'))
          break
        case CurveError.CADCTransferFailed:
          setMessage(t('curveERC20TransferFailedMessage'))
          break
      }
    },
    [t]
  )

  return { message, getErrorMessage }
}

export default useErrorMessage
