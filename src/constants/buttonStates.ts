export enum ModalState {
  NotConfirmed,
  InProgress,
  Successful,
  Failed
}

export enum ButtonState {
  Default,
  EnterAmount,
  Approving,
  Approved,
  Next,
  Confirming,
  InsufficientBalance,
  Retry,
  MaxCap,
  Swap,
  InsufficientLiquidity,
  NotMinimum
}

export enum SwapButtonState {
  Default,
  EnterAmount,
  Approving,
  Approved,
  Next,
  Confirming,
  Retry,
  MaxCap,
  Swap,
  InsufficientLiquidity,
  InsufficientBalance
}

export enum ErrorDisplayType {
  Inline,
  Modal
}