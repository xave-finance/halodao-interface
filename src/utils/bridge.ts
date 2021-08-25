export function calculateShuttleFee(amount: number) {
  return amount * Number(process.env.REACT_APP_SHUTTLE_FEE_PERCENTAGE)
}