import { renderHook, act } from '@testing-library/react-hooks'
import useErrorMessage, { HaloError } from 'halo-hooks/useErrorMessage'

// test('should use counter', () => {
//     const { result } = renderHook(() => useErrorMessage())

//     // expect(result.current.friendlyErrorMessage).toBeCalled()
//     expect(typeof result.current.getFriendlyErrorMessage).toBe('function')
//     // expect(typeof result.current.increment).toBe('function')
// })

jest.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: any) => key }),
}));

describe('Friendly Error Message Test', () => {
    it('Should return default friendly error message when there is no match found', () => {
        const { result } = renderHook(() => useErrorMessage())
        const errorObject = {
            code: 0,
            data: '',
            message: 'execution reverted'
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveDefault")
    })
    // Curve/re-entered
    it('Should return the equivalent Curve re-entered friendly error', () => {
        const { result } = renderHook(() => useErrorMessage())
        let errorFromContract = 'execution reverted: Curve/re-entered'
        const errorCode = -32603
        const errorData = ''
        let errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveReentered")

        errorFromContract = 'Curve/re-entered'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveReentered")

        errorFromContract = 're-entered'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveReentered")
    })
    /* 
    Curve/insufficient-allowance
    Curve/approval-overflow
    Curve/allowance-decrease-underflow
    */
    it('Should return the equivalent Curve allowance friendly error', () => {
        const { result } = renderHook(() => useErrorMessage())
        let errorFromContract = 'execution reverted: Curve/allowance-decrease-underflow'
        const errorCode = -32603
        const errorData = ''
        let errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveAllowance")

        errorFromContract = 'Curve/allowance-decrease-underflow'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveAllowance")

        errorFromContract = 'execution reverted: Curve/approval-overflow'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveAllowance")

        errorFromContract = 'Curve/approval-overflow'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveAllowance")

        errorFromContract = 'execution reverted: Curve/insufficient-allowance'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveAllowance")

        errorFromContract = 'Curve/insufficient-allowance'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveAllowance")
    })
    // Curve/frozen-only-allowing-proportional-withdraw
    it('Should return the equivalent Curve frozen friendly error', () => {
        const { result } = renderHook(() => useErrorMessage())
        let errorFromContract = 'execution reverted: Curve/frozen-only-allowing-proportional-withdraw'
        const errorCode = -32603
        const errorData = ''
        let errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveFrozen")

        errorFromContract = 'Curve/frozen-only-allowing-proportional-withdraw'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveFrozen")

        errorFromContract = 'frozen-only-allowing-proportional-withdraw'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveFrozen")
    })
    // Curve/tx-deadline-passed
    it('Should return the equivalent Curve deadline passed friendly error', () => {
        const { result } = renderHook(() => useErrorMessage())
        let errorFromContract = 'execution reverted: Curve/tx-deadline-passed'
        const errorCode = -32603
        const errorData = ''
        let errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveDeadlinePassed")

        errorFromContract = 'Curve/tx-deadline-passed'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveDeadlinePassed")

        errorFromContract = 'tx-deadline-passed'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveDeadlinePassed")
    })
    // Curve/whitelist-stage-on-going
    it('Should return the equivalent Curve whitelist on-going friendly error', () => {
        const { result } = renderHook(() => useErrorMessage())
        let errorFromContract = 'execution reverted: Curve/whitelist-stage-on-going'
        const errorCode = -32603
        const errorData = ''
        let errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveWhitelistingStage")

        errorFromContract = 'Curve/whitelist-stage-on-going'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveWhitelistingStage")

        errorFromContract = 'whitelist-stage-on-going'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveWhitelistingStage")
    })
    // Curve/whitelist-stage-stopped
    it('Should return the equivalent Curve whitelist stopped friendly error', () => {
        const { result } = renderHook(() => useErrorMessage())
        let errorFromContract = 'execution reverted: Curve/whitelist-stage-stopped'
        const errorCode = -32603
        const errorData = ''
        let errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveNotWhitelistingStage")

        errorFromContract = 'Curve/whitelist-stage-stopped'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveNotWhitelistingStage")

        errorFromContract = 'whitelist-stage-stopped'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveNotWhitelistingStage")
    })
    // Curve/amount-too-large
    it('Should return the equivalent Curve whitelist stopped friendly error', () => {
        const { result } = renderHook(() => useErrorMessage())
        let errorFromContract = 'execution reverted: Curve/amount-too-large'
        const errorCode = -32603
        const errorData = ''
        let errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveAmountTooLarge")

        errorFromContract = 'Curve/amount-too-large'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveAmountTooLarge")

        errorFromContract = 'amount-too-large'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveAmountTooLarge")
    })
    // swap failed
    it('Should return the equivalent Curve swap failed friendly error', () => {
        const { result } = renderHook(() => useErrorMessage())
        let errorFromContract = 'execution reverted: Curve/swap-convergence-failed'
        const errorCode = -32603
        const errorData = ''
        let errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapFailed")

        errorFromContract = 'Curve/swap-convergence-failed'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapFailed")

        errorFromContract = 'swap-convergence-failed'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapFailed")

        // Curve/swap-invariant-violation
        errorFromContract = 'execution reverted: Curve/swap-invariant-violation'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapFailed")

        errorFromContract = 'Curve/swap-invariant-violation'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapFailed")

        errorFromContract = 'swap-invariant-violation'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapFailed")

        // Curve/liquidity-invariant-violation
        errorFromContract = 'execution reverted: Curve/liquidity-invariant-violation'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapFailed")

        errorFromContract = 'Curve/liquidity-invariant-violation'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapFailed")

        errorFromContract = 'liquidity-invariant-violation'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapFailed")
    })
    // Maximunm imbalance
    it('Should return the equivalent Curve maximunm imbalance friendly error', () => {
        const { result } = renderHook(() => useErrorMessage())
        let errorFromContract = 'execution reverted: Curve/lower-halt'
        const errorCode = -32603
        const errorData = ''
        let errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapHalt")

        errorFromContract = 'Curve/lower-halt'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapHalt")

        errorFromContract = 'lower-halt'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapHalt")

        // Curve/upper-halt
        errorFromContract = 'execution reverted: Curve/upper-halt'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapHalt")

        errorFromContract = 'Curve/upper-halt'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapHalt")

        errorFromContract = 'upper-halt'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapHalt")

        // Curve/below-min-target-amount
        errorFromContract = 'execution reverted: Curve/below-min-target-amount'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapHalt")

        errorFromContract = 'Curve/below-min-target-amount'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapHalt")

        errorFromContract = 'below-min-target-amount'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveSwapHalt")
    })
    // Curve/CADC-transfer-from-failed
    it('Should return the equivalent Curve whitelist stopped friendly error', () => {
        const { result } = renderHook(() => useErrorMessage())
        let errorFromContract = 'execution reverted: Curve/CADC-transfer-from-failed'
        const errorCode = -32603
        const errorData = ''
        let errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveERC20TransferFailed")

        errorFromContract = 'Curve/CADC-transfer-from-failed'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveERC20TransferFailed")

        errorFromContract = 'CADC-transfer-from-failed'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageCurveERC20TransferFailed")
    })
    // SafeMath: subtraction overflow
    it('Should return the equivalent SafeMath subtraction overflow friendly error', () => {
        const { result } = renderHook(() => useErrorMessage())
        let errorFromContract = 'SafeMath: subtraction overflow'
        const errorCode = 0
        const errorData = ''
        let errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageSubtractionOverflow")
    })
    // SafeMath: division by zero
    it('Should return the equivalent SafeMath division by zero friendly error', () => {
        const { result } = renderHook(() => useErrorMessage())
        let errorFromContract = 'SafeMath: division by zero'
        const errorCode = 0
        const errorData = ''
        let errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageSafeMathDivisionByZero")
    })
    // User rejected tx
    it('Should return the equivalent Metamask user rejected tx friendly error', () => {
        const { result } = renderHook(() => useErrorMessage())
        let errorFromContract = 'MetaMask Tx Signature: User denied transaction signature.'
        const errorCode = 4001
        const errorData = ''
        let errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageMetamaskRejection")

        errorFromContract = 'User denied transaction signature'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageMetamaskRejection")

        errorFromContract = 'MetaMask Tx Signature'
        errorObject = {
            code: errorCode,
            data: errorData,
            message: errorFromContract
        }
        act(() => {
            result.current.getFriendlyErrorMessage(errorObject)
        })
        expect(result.current.friendlyErrorMessage).toBe("errorMessageMetamaskRejection")
    })
})