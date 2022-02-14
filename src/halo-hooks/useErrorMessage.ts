import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CurveErrorMessage, GeneralErrorMessage } from '../constants/errors'

export enum GeneralError {
  SubtractionOverflow = 'SafeMath: subtraction overflow',
  MetamaskRejection = 'User denied transaction signature.'
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
        case CurveErrorMessage.CurveReentered:
          setMessage(t('errorMessageCurveDefault'))
          break
        case CurveErrorMessage.AllowanceDecreaseUnderflow:
          setMessage(t('errorMessageCurveAllowance'))
          break
        case CurveErrorMessage.ApprovalOverflow:
          setMessage(t('errorMessageCurveAllowance'))
          break
        case CurveErrorMessage.InsufficientAllowance:
          setMessage(t('errorMessageCurveAllowance'))
          break
        case CurveErrorMessage.Frozen:
          setMessage(t('errorMessageCurveFrozen"'))
          break
        case CurveErrorMessage.EmergencyState:
          setMessage(t('errorMessageCurveEmergency'))
          break
        case CurveErrorMessage.TransactionDeadlinePassed:
          setMessage(t('errorMessageCurveDeadlinePassed'))
          break
        case CurveErrorMessage.WhitelistOnGoing:
          setMessage(t('errorMessageCurveWhitelistingStage'))
          break
        case CurveErrorMessage.WhitelistStopped:
          setMessage(t('errorMessageCurveNotWhitelistingStage'))
          break
        case CurveErrorMessage.SwapAmountTooLarge:
          setMessage(t('errorMessageCurveAmountTooLarge'))
          break
        case CurveErrorMessage.SwapConvergenceFailed:
          setMessage(t('errorMessageCurveSwapFailed'))
          break
        case CurveErrorMessage.SwapInvariantViolation:
          setMessage(t('errorMessageCurveSwapFailed'))
          break
        case CurveErrorMessage.LiquidityInvariantViolation:
          setMessage(t('errorMessageCurveSwapFailed'))
          break
        case CurveErrorMessage.UpperHalt:
          setMessage(t('errorMessageCurveSwapHalt'))
          break
        case CurveErrorMessage.LowerHalt:
          setMessage(t('errorMessageCurveSwapHalt'))
          break
        case CurveErrorMessage.CADCTransferFailed:
          setMessage(t('errorMessageCurveERC20TransferFailed'))
          break
        case GeneralErrorMessage.SubtractionOverflow:
          setMessage(t('errorMessageSubtractionOverflow'))
          break
        case GeneralErrorMessage.MetamaskRejection:
          setMessage(t('errorMessageMetamaskRejection'))
          break
        case GeneralError.SubtractionOverflow:
          setMessage(t('SubtractionOverflowErrorMessage'))
          break
        case GeneralError.MetamaskRejection:
          setMessage(t('MetamaskRejectionErrorMessage'))
          break
      }
    },
    [t]
  )

  return { message, getErrorMessage }
}

export default useErrorMessage
