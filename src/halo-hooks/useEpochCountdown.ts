import { ApolloClient, gql, InMemoryCache } from '@apollo/client'

const useEpochCountdown = () => {
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
      const lastReleaseDate = new Date(data.data.epochReleases[0].timestamp * 1000).getDate()
      console.log(lastReleaseDate)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dateNow = tomorrow.getTime()

      // Find the distance between now and the countdown date
      const distance = lastReleaseDate - dateNow

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      console.log(days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ')
    })
    .catch(err => {
      console.log('Error fetching data: ', err)
    })
}

export default useEpochCountdown
