export enum CurveErrorMessage {
  CurveReentered = 'Curve/re-entered',
  AllowanceDecreaseUnderflow = 'Curve/allowance-decrease-underflow',
  ApprovalOverflow = 'Curve/approval-overflow',
  InsufficientAllowance = 'Curve/insufficient-allowance',
  Frozen = 'Curve/frozen-only-allowing-proportional-withdraw',
  EmergencyState = 'Curve/emergency-only-allowing-emergency-proportional-withdraw',
  TransactionDeadlinePassed = 'Curve/tx-deadline-passed',
  WhitelistOnGoing = 'Curve/whitelist-stage-on-going',
  WhitelistStopped = 'Curve/whitelist-stage-stopped',
  SwapAmountTooLarge = 'Curve/amount-too-large',
  SwapConvergenceFailed = 'Curve/swap-convergence-failed',
  SwapInvariantViolation = 'Curve/swap-invariant-violation',
  LiquidityInvariantViolation = 'Curve/liquidity-invariant-violation',
  UpperHalt = 'Curve/upper-halt',
  LowerHalt = 'Curve/lower-halt',
  CADCTransferFailed = 'Curve/CADC-transfer-from-failed' // change in case and token
}

export enum GeneralErrorMessage {
  SubtractionOverflow = 'SafeMath: subtraction overflow',
  MetamaskRejection = 'MetaMask Tx Signature: User denied transaction signature.'
}

export enum MetamaskErrorCode {
  Cancelled = 4001,
  Reverted = -32015
}

export enum ZapErrorCode {
  SlippageTooLow = -32016
}

export enum ZapErrorMessage {
  NotEnoughLpAmount = '!Zap/not-enough-lp-amount'
}
<<<<<<< HEAD
=======

export enum MetamaskError {
  Cancelled = 4001,
  Reverted = -32015
}
>>>>>>> hdev-255-error-handler-in-single-sided-not-enough-liquidity
