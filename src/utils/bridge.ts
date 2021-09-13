// export function calculateShuttleFee(amount: number) {
//   return (amount * Number(process.env.REACT_APP_SHUTTLE_FEE_PERCENTAGE ?? 0)).toFixed(18).replace(/\.?0+$/, '')
// }

export function calculateShuttleFee(tokenSymbol: string) {
  if (tokenSymbol.startsWith('w')) {
    return 20
  }
  return 1
}
