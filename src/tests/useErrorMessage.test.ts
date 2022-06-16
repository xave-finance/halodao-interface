import { renderHook, act } from '@testing-library/react-hooks'
import { CurveErrorMessage, GeneralErrorMessage, ZapErrorMessage } from 'constants/errors'
import useErrorMessage from 'halo-hooks/useErrorMessage'
import { HaloError, HaloErrorDomain } from 'utils/errors/HaloError'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key })
}))

describe('useErrorMessage', () => {
  describe('getFriendlyErrorMessage', () => {
    it('Should return default friendly error message if error is unknown', () => {
      const { result } = renderHook(() => useErrorMessage())
      const error = new Error('VM execution error')
      act(() => {
        result.current.getFriendlyErrorMessage(error)
      })
      expect(result.current.friendlyErrorMessage).toBe('errorMessageGeneric')
    })

    it('Should return correct friendly error message for known curve errors - normal error', () => {
      const { result } = renderHook(() => useErrorMessage())

      const errorMap = new Map()
      errorMap.set(CurveErrorMessage.CurveReentered, 'errorMessageCurveReentered')
      errorMap.set(CurveErrorMessage.AllowanceDecreaseUnderflow, 'errorMessageCurveAllowance')
      errorMap.set(CurveErrorMessage.BelowMinTargetAmount, 'errorMessageCurveSwapHalt')
      errorMap.set(CurveErrorMessage.ApprovalOverflow, 'errorMessageCurveAllowance')
      errorMap.set(CurveErrorMessage.InsufficientAllowance, 'errorMessageCurveAllowance')
      errorMap.set(CurveErrorMessage.Frozen, 'errorMessageCurveFrozen')
      errorMap.set(CurveErrorMessage.EmergencyState, 'errorMessageCurveEmergency')
      errorMap.set(CurveErrorMessage.TransactionDeadlinePassed, 'errorMessageCurveDeadlinePassed')
      errorMap.set(CurveErrorMessage.WhitelistOnGoing, 'errorMessageCurveWhitelistingStage')
      errorMap.set(CurveErrorMessage.WhitelistStopped, 'errorMessageCurveNotWhitelistingStage')
      errorMap.set(CurveErrorMessage.SwapAmountTooLarge, 'errorMessageCurveAmountTooLarge')
      errorMap.set(CurveErrorMessage.SwapConvergenceFailed, 'errorMessageCurveSwapFailed')
      errorMap.set(CurveErrorMessage.SwapInvariantViolation, 'errorMessageCurveSwapFailed')
      errorMap.set(CurveErrorMessage.LiquidityInvariantViolation, 'errorMessageCurveSwapFailed')
      errorMap.set(CurveErrorMessage.UpperHalt, 'errorMessageCurveSwapHalt')
      errorMap.set(CurveErrorMessage.LowerHalt, 'errorMessageCurveSwapHalt')
      errorMap.set(CurveErrorMessage.CADCTransferFailed, 'errorMessageCurveERC20TransferFailed')
      errorMap.set(GeneralErrorMessage.SubtractionOverflow, 'errorMessageSubtractionOverflow')
      errorMap.set(GeneralErrorMessage.MetamaskRejection, 'errorMessageMetamaskRejection')
      errorMap.set(GeneralErrorMessage.SafeMathDivisionByZero, 'errorMessageSafeMathDivisionByZero')
      errorMap.set(ZapErrorMessage.NotEnoughLpAmount, 'error-liquidity-zap-reverted')

      errorMap.forEach((value, key) => {
        const error = new Error(key)
        act(() => {
          result.current.getFriendlyErrorMessage(error)
        })
        expect(result.current.friendlyErrorMessage).toBe(value)
      })
    })

    it('Should return correct friendly error message for known curve errors - tx as error', () => {
      const { result } = renderHook(() => useErrorMessage())

      const errorMap = new Map()
      errorMap.set(CurveErrorMessage.CurveReentered, 'errorMessageCurveReentered')
      errorMap.set(CurveErrorMessage.AllowanceDecreaseUnderflow, 'errorMessageCurveAllowance')
      errorMap.set(CurveErrorMessage.BelowMinTargetAmount, 'errorMessageCurveSwapHalt')
      errorMap.set(CurveErrorMessage.ApprovalOverflow, 'errorMessageCurveAllowance')
      errorMap.set(CurveErrorMessage.InsufficientAllowance, 'errorMessageCurveAllowance')
      errorMap.set(CurveErrorMessage.Frozen, 'errorMessageCurveFrozen')
      errorMap.set(CurveErrorMessage.EmergencyState, 'errorMessageCurveEmergency')
      errorMap.set(CurveErrorMessage.TransactionDeadlinePassed, 'errorMessageCurveDeadlinePassed')
      errorMap.set(CurveErrorMessage.WhitelistOnGoing, 'errorMessageCurveWhitelistingStage')
      errorMap.set(CurveErrorMessage.WhitelistStopped, 'errorMessageCurveNotWhitelistingStage')
      errorMap.set(CurveErrorMessage.SwapAmountTooLarge, 'errorMessageCurveAmountTooLarge')
      errorMap.set(CurveErrorMessage.SwapConvergenceFailed, 'errorMessageCurveSwapFailed')
      errorMap.set(CurveErrorMessage.SwapInvariantViolation, 'errorMessageCurveSwapFailed')
      errorMap.set(CurveErrorMessage.LiquidityInvariantViolation, 'errorMessageCurveSwapFailed')
      errorMap.set(CurveErrorMessage.UpperHalt, 'errorMessageCurveSwapHalt')
      errorMap.set(CurveErrorMessage.LowerHalt, 'errorMessageCurveSwapHalt')
      errorMap.set(CurveErrorMessage.CADCTransferFailed, 'errorMessageCurveERC20TransferFailed')
      errorMap.set(GeneralErrorMessage.SubtractionOverflow, 'errorMessageSubtractionOverflow')
      errorMap.set(GeneralErrorMessage.MetamaskRejection, 'errorMessageMetamaskRejection')
      errorMap.set(GeneralErrorMessage.SafeMathDivisionByZero, 'errorMessageSafeMathDivisionByZero')
      errorMap.set(ZapErrorMessage.NotEnoughLpAmount, 'error-liquidity-zap-reverted')

      errorMap.forEach((value, key) => {
        const tx = {
          data: {
            message: key
          }
        }
        act(() => {
          result.current.getFriendlyErrorMessage(tx as any)
        })
        expect(result.current.friendlyErrorMessage).toBe(value)
      })
    })

    it('Should return correct friendly error message for HaloError(s)', () => {
      const { result } = renderHook(() => useErrorMessage())

      const haloErrorMsgs = ['error-vm-exception', 'error-liquidity-estimates-changed', 'error-liquidity-zap-reverted']

      haloErrorMsgs.map(errorMsg => {
        const error = new HaloError(errorMsg, HaloErrorDomain.Liquidity)
        act(() => {
          result.current.getFriendlyErrorMessage(error)
        })
        expect(result.current.friendlyErrorMessage).toBe(errorMsg)
      })
    })
  })
})
