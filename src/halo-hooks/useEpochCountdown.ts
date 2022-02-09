import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import useInterval from '../hooks/useInterval'
import { useCallback, useState } from 'react'

interface CurrentEpoch {
  days: number
  hours: number
  minutes: number
  seconds: number
}
const useEpochCountdown = () => {
  const [nextReleaseDate, setNextReleaseDate] = useState<CurrentEpoch>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [lastEpoch, setLasEpoch] = useState(0)
  const APIURL = 'https://api.thegraph.com/subgraphs/name/geonellov/rewardsv2'

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
        minutes: 0,
        seconds: 0
      })
      return
    }
    const nextReleaseDate = new Date(lastEpoch * 1000)
    nextReleaseDate.setDate(nextReleaseDate.getDate() + 30)
    const dateNow = new Date().getTime()

    // Find the distance between now and the countdown date
    const distance = nextReleaseDate.getTime() - dateNow

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    setNextReleaseDate({
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    })
  }, [lastEpoch])

  useInterval(getNextEpoch, 1000)
  return nextReleaseDate
}

export default useEpochCountdown
