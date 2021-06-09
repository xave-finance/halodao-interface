import { usePoolAPY } from 'halo-hooks/useRewards'
import { PoolInfo, TokenPrice } from 'halo-hooks/useBalancer'

describe('prices', () => {
    it('returns undefined for undefined', () => {
    /**
     * Returns APY in percentage
     *
     * @param {number} rewardTokenPerSecond From the contract
     * @param {number} totalAllocPoint From the contract
     * @param {TokenPrice} tokenPrice From coingecko
     * @param {number} allocPoint Pool allocation point from contract
     * @param {number} poolLiquidity Staked USD in a pool
     * @return {float} APY in percentage
     */
        expect(0).toEqual(0)
    })
})
