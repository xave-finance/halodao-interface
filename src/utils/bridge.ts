export function calculateShuttleFee(amount: number) {
  return amount * (1 - Number(process.env.REACT_APP_SHUTTLE_FEE_PERCENTAGE))
}
