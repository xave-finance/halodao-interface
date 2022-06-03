import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import useInterval from '../hooks/useInterval'
import { useCallback, useEffect, useState } from 'react'
import { HALODAO_EXCHANGE_SUBGRAPH_HOSTED, HALODAO_EXCHANGE_SUBGRAPH_STUDIO } from '../constants'
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

  const epochQuery = `
    query {
      epochReleases(orderBy: timestamp, orderDirection: desc, first: 1) {
        id
        timestamp
        amount
      }
    }
  `
  async function getStudio() {
    const APIURL = HALODAO_EXCHANGE_SUBGRAPH_STUDIO[ChainId.MAINNET]
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache()
    })
    return client.query({
      query: gql(epochQuery)
    })
  }

  async function getHosted() {
    const APIURL = HALODAO_EXCHANGE_SUBGRAPH_HOSTED[ChainId.MAINNET]
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache()
    })
    return client.query({
      query: gql(epochQuery)
    })
  }

  function setData(data: any) {
    setLasEpoch(data.data.epochReleases[0].timestamp)
  }

  useEffect(() => {
    try {
      getStudio()
        .then(data => {
          setData(data)
        })
        .catch(err => {
          console.log('Error fetching data on Studio: ', err)
          console.log('Trying to get data in Hosted')
          getHosted().then(data => {
            setData(data)
          })
        })
    } catch (e) {
      console.error('Error fetching data in Studio and Hosted')
    }
  }, [ChainId]) //eslint-disable-line

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

  useInterval(getNextEpoch, 1000)
  return nextReleaseDate
}

export default useEpochCountdown
