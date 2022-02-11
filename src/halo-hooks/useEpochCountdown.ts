import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import useInterval from '../hooks/useInterval'
import { useCallback, useState } from 'react'
import { HALODAO_EXCHANGE_SUBGRAPH } from '../constants'
import { ChainId } from '@halodao/sdk'

export interface CurrentEpoch {
  days: number
  hours: number
  minutes: number
}

const useEpochCountdown = () => {
  const [nextReleaseDate, setNextReleaseDate] = useState<CurrentEpoch>({
    days: 0,
    hours: 0,
    minutes: 0
  })
  const [lastEpoch, setLasEpoch] = useState(0)
  const APIURL = HALODAO_EXCHANGE_SUBGRAPH[ChainId.MAINNET]

  const epochQuery = `
    query {
      epochReleases(orderBy: timestamp, orderDirection: desc, first: 1) {
        id
        timestamp
        amount
      }
    }
  `
  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache()
  })
  client
    .query({
      query: gql(epochQuery)
    })
    .then(data => {
      setLasEpoch(data.data.epochReleases[0].timestamp)
    })
    .catch(err => {
      console.log('Error fetching data: ', err)
    })

  const getNextEpoch = useCallback(() => {
    // Get the latest release date of rewards then add 30 days into it
    if (lastEpoch <= 0) {
      setNextReleaseDate({
        days: 0,
        hours: 0,
        minutes: 0
      })
      return
    }
    const nextReleaseDate = new Date(lastEpoch * 1000)
    nextReleaseDate.setDate(nextReleaseDate.getDate() + 30)
    const dateNow = new Date().getTime()

    // Find the distance between now and the countdown date
    const distance = nextReleaseDate.getTime() - dateNow

    // Time calculations for days, hours, and minutes
    const days = distance <= 0 ? 0 : Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = distance <= 0 ? 0 : Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = distance <= 0 ? 0 : Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

    setNextReleaseDate({
      days: days,
      hours: hours,
      minutes: minutes
    })
  }, [lastEpoch])

  useInterval(getNextEpoch, 60000)
  return nextReleaseDate
}

export default useEpochCountdown
