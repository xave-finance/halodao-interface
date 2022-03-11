import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CurveErrorMessage, GeneralErrorMessage } from '../constants/errors'

export type HaloError = {
  code: number
  data: string
  message: string
}

const useErrorMessage = () => {
  const { t } = useTranslation()
  const [friendlyErrorMessage, setFriendlyErrorMessage] = useState(t('errorMessageCurveDefault'))

  const getFriendlyErrorMessage = useCallback(
    (errorObject: HaloError) => {
      switch (errorObject.message) {
        case CurveErrorMessage.CurveReentered:
          setFriendlyErrorMessage(t('errorMessageCurveDefault'))
          break
        case CurveErrorMessage.AllowanceDecreaseUnderflow:
          setFriendlyErrorMessage(t('errorMessageCurveAllowance'))
          break
        case CurveErrorMessage.ApprovalOverflow:
          setFriendlyErrorMessage(t('errorMessageCurveAllowance'))
          break
        case CurveErrorMessage.InsufficientAllowance:
          setFriendlyErrorMessage(t('errorMessageCurveAllowance'))
          break
        case CurveErrorMessage.Frozen:
          setFriendlyErrorMessage(t('errorMessageCurveFrozen"'))
          break
        case CurveErrorMessage.EmergencyState:
          setFriendlyErrorMessage(t('errorMessageCurveEmergency'))
          break
        case CurveErrorMessage.TransactionDeadlinePassed:
          setFriendlyErrorMessage(t('errorMessageCurveDeadlinePassed'))
          break
        case CurveErrorMessage.WhitelistOnGoing:
          setFriendlyErrorMessage(t('errorMessageCurveWhitelistingStage'))
          break
        case CurveErrorMessage.WhitelistStopped:
          setFriendlyErrorMessage(t('errorMessageCurveNotWhitelistingStage'))
          break
        case CurveErrorMessage.SwapAmountTooLarge:
          setFriendlyErrorMessage(t('errorMessageCurveAmountTooLarge'))
          break
        case CurveErrorMessage.SwapConvergenceFailed:
          setFriendlyErrorMessage(t('errorMessageCurveSwapFailed'))
          break
        case CurveErrorMessage.SwapInvariantViolation:
          setFriendlyErrorMessage(t('errorMessageCurveSwapFailed'))
          break
        case CurveErrorMessage.LiquidityInvariantViolation:
          setFriendlyErrorMessage(t('errorMessageCurveSwapFailed'))
          break
        case CurveErrorMessage.UpperHalt:
          setFriendlyErrorMessage(t('errorMessageCurveSwapHalt'))
          break
        case CurveErrorMessage.LowerHalt:
          setFriendlyErrorMessage(t('errorMessageCurveSwapHalt'))
          break
        case CurveErrorMessage.CADCTransferFailed:
          setFriendlyErrorMessage(t('errorMessageCurveERC20TransferFailed'))
          break
        case GeneralErrorMessage.SubtractionOverflow:
          setFriendlyErrorMessage(t('errorMessageSubtractionOverflow'))
          break
        case GeneralErrorMessage.MetamaskRejection:
          setFriendlyErrorMessage(t('errorMessageMetamaskRejection'))
          break
      }
    },
    [t]
  )

  return { friendlyErrorMessage, getFriendlyErrorMessage }
}

export default useErrorMessage
