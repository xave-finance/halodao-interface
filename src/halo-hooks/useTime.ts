import { useCallback } from 'react'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'

export const useTime = () => {
  const currentBlockTime = useCurrentBlockTimestamp()

  const getFutureTime = useCallback(
    (addMinutes = 300) => {
      if (currentBlockTime) {
        return currentBlockTime.add(addMinutes).toNumber()
      }
      return new Date().getTime() + addMinutes
    },
    [currentBlockTime]
  )

  return { getFutureTime }
}
