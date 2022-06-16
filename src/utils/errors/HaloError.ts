export enum HaloErrorDomain {
  Generic = 'Generic',
  Swap = 'Swap',
  Liquidity = 'AddLiquidity',
  Rewards = 'Rewards',
  Vesting = 'Vesting',
  Bridge = 'Bridge'
}

export class HaloError extends Error {
  domain: HaloErrorDomain

  constructor(message: string, domain: HaloErrorDomain) {
    super(message)
    this.name = 'HaloError'
    this.domain = domain
  }
}
