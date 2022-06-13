import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { consoleLog } from 'utils/simpleLogger'
import { CurveErrorMessage, GeneralErrorMessage, ZapErrorMessage } from '../constants/errors'

export type HaloError = {
  code: number
  data: string
  message: string
}

const useErrorMessage = () => {
  const { t } = useTranslation()
  const [friendlyErrorMessage, setFriendlyErrorMessage] = useState(t('errorMessageCurveDefault'))
  let errorMatched = false

  const getFriendlyErrorMessage = useCallback(
    (errorObject: HaloError) => {
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
      consoleLog('errorObject', errorObject)
      consoleLog('errorObject.code', typeof errorObject.code)
      consoleLog('errorObject.message', errorObject.message)
      errorMap.forEach((value, key) => {
        if (errorObject.message.includes(key)) {
          setFriendlyErrorMessage(value)
          errorMatched = true
        }
      })
      if (typeof errorObject.message === 'undefined') {
        setFriendlyErrorMessage(t('errorMessageCurveDefault'))
        errorMatched = true
      }
      if (typeof errorObject.code === 'undefined') {
        setFriendlyErrorMessage(errorObject.message)
        errorMatched = true
      }
      console.log('errorMatched', errorMatched)
      if (errorMatched === false) {
        setFriendlyErrorMessage(t('errorMessageCurveDefault'))
      }
    },
    [t]
  )

  return { friendlyErrorMessage, getFriendlyErrorMessage }
}

export default useErrorMessage
