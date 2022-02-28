/**
 * Represents the externals pool ids of a liquidity pool
 * @key pool's address on the blockchain
 * @rewardsPoolId the pool id in the context of AmmRewards
 * @vaultPoolId the pool id in the context of Vault
 */
export type PoolExternalIdsMap = {
  [key: string]: {
    rewardsPoolId?: number
    vaultPoolId?: string
  }
}
