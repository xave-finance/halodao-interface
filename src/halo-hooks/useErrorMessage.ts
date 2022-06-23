import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HaloError } from 'utils/errors/HaloError'
import { CurveErrorMessage, GeneralErrorMessage, ZapErrorMessage } from '../constants/errors'

const useErrorMessage = () => {
  const { t } = useTranslation()
  const [friendlyErrorMessage, setFriendlyErrorMessage] = useState(t('errorMessageGeneric'))

  const getFriendlyErrorMessage = useCallback(
    (error: Error) => {
      const errorMap = new Map()
      errorMap.set(CurveErrorMessage.CurveReentered, t('errorMessageCurveReentered'))
      errorMap.set(CurveErrorMessage.AllowanceDecreaseUnderflow, t('errorMessageCurveAllowance'))
      errorMap.set(CurveErrorMessage.BelowMinTargetAmount, t('errorMessageCurveSwapHalt'))
      errorMap.set(CurveErrorMessage.ApprovalOverflow, t('errorMessageCurveAllowance'))
      errorMap.set(CurveErrorMessage.InsufficientAllowance, t('errorMessageCurveAllowance'))
      errorMap.set(CurveErrorMessage.Frozen, t('errorMessageCurveFrozen'))
      errorMap.set(CurveErrorMessage.EmergencyState, t('errorMessageCurveEmergency'))
      errorMap.set(CurveErrorMessage.TransactionDeadlinePassed, t('errorMessageCurveDeadlinePassed'))
      errorMap.set(CurveErrorMessage.WhitelistOnGoing, t('errorMessageCurveWhitelistingStage'))
      errorMap.set(CurveErrorMessage.WhitelistStopped, t('errorMessageCurveNotWhitelistingStage'))
      errorMap.set(CurveErrorMessage.SwapAmountTooLarge, t('errorMessageCurveAmountTooLarge'))
      errorMap.set(CurveErrorMessage.SwapConvergenceFailed, t('errorMessageCurveSwapFailed'))
      errorMap.set(CurveErrorMessage.SwapInvariantViolation, t('errorMessageCurveSwapFailed'))
      errorMap.set(CurveErrorMessage.LiquidityInvariantViolation, t('errorMessageCurveSwapFailed'))
      errorMap.set(CurveErrorMessage.UpperHalt, t('errorMessageCurveSwapHalt'))
      errorMap.set(CurveErrorMessage.LowerHalt, t('errorMessageCurveSwapHalt'))
      errorMap.set(CurveErrorMessage.CADCTransferFailed, t('errorMessageCurveERC20TransferFailed'))
      errorMap.set(GeneralErrorMessage.SubtractionOverflow, t('errorMessageSubtractionOverflow'))
      errorMap.set(GeneralErrorMessage.MetamaskRejection, t('errorMessageMetamaskRejection'))
      errorMap.set(GeneralErrorMessage.SafeMathDivisionByZero, t('errorMessageSafeMathDivisionByZero'))
      errorMap.set(ZapErrorMessage.NotEnoughLpAmount, t('error-liquidity-zap-reverted'))

      let errorMsg: string | undefined = undefined
      errorMap.forEach((value, key) => {
        if (
          (error.message && error.message.includes(key)) || // normal Error
          (error instanceof HaloError &&
            (error as HaloError).uderlyingTx &&
            (error as HaloError).uderlyingTx.data.message.includes(key)) // HaloError with underlying tx
        ) {
          errorMsg = value
        }
      })

      if (errorMsg) {
        setFriendlyErrorMessage(errorMsg)
      } else if (error instanceof HaloError) {
        setFriendlyErrorMessage(error.message)
      } else {
        setFriendlyErrorMessage(t('errorMessageGeneric'))
      }
    },
    [t]
  )

  return { friendlyErrorMessage, getFriendlyErrorMessage }
}

export default useErrorMessage
