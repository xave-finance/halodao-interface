import { useEffect } from 'react'
import useBalancerSDK from './useBalancerSDK'

const useSwap = () => {
  const balancer = useBalancerSDK()

  useEffect(() => {
    console.log('[BalancerSDK] Fetching pools...')
    try {
      balancer.sor.fetchPools().then(() => {
        console.log('[BalancerSDK] Pools fetched!')
        // @todo: what else todo after fetching balancer pools?
      })
    } catch (e) {
      console.error('[BalancerSDK] Error fetching pools')
      console.error(e)
    }
  }, [balancer])
}

export default useSwap
