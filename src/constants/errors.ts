/**
 * Generic Errors
 */
export enum GeneralErrorMessage {
  SubtractionOverflow = 'SafeMath: subtraction overflow',
  MetamaskRejection = 'MetaMask Tx Signature: User denied transaction signature.'
}

/**
 * Metamask Errors
 * Source: https://github.com/MetaMask/eth-rpc-errors/blob/main/src/error-constants.ts
 */

export enum MetamaskRPCErrorCode {
  invalidInput = -32000,
  resourceNotFound = -32001,
  resourceUnavailable = -32002,
  transactionRejected = -32003,
  methodNotSupported = -32004,
  limitExceeded = -32005,
  reverted = -32015,
  parse = -32700,
  invalidRequest = -32600,
  methodNotFound = -32601,
  invalidParams = -32602,
  internal = -32603
}

export enum MetamaskProviderErrorCode {
  userRejectedRequest = 4001,
  unauthorized = 4100,
  unsupportedMethod = 4200,
  disconnected = 4900,
  chainDisconnected = 4901
}

/**
 * AMM v1 (Curve) Errors
 */

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

export enum ZapErrorCode {
  SlippageTooLow = -32016
}

export enum ZapErrorMessage {
  NotEnoughLpAmount = '!Zap/not-enough-lp-amount'
}
