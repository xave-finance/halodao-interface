export class HaloError extends Error {
  uderlyingTx: any // an optional metamask transaction which caused the error

  constructor(_message: string, _uderlyingTx?: any) {
    super(_message)
    this.name = 'HaloError'
    this.uderlyingTx = _uderlyingTx
  }
}
