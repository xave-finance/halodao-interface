import { useEffect } from 'react'
import useBalancerSDK from './useBalancerSDK'

const useSwap = () => {
  const balancer = useBalancerSDK()

  useEffect(() => {
    if (!balancer) return

    console.log('[BalancerSDK] Fetching pools...')
    try {
      balancer.sor
        .fetchPools()
        .then(success => {
          console.log('[BalancerSDK] Pools fetched', success ? 'successfully' : 'with errors')
          return balancer.sor.getPools()
          // @todo: what else todo after fetching balancer pools?
        })
        .then(pools => {
          console.log('[BalancerSDK] Pools: ', pools)
        })
    } catch (e) {
      console.error('[BalancerSDK] Error fetching pools')
      console.error(e)
    }
  }, [balancer])

  return {
    balancer
  }
}

export default useSwap
