import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { RedirectPathToFarmOnly } from './Swap/redirects'
import Farm from './Farm'
import HaloHalo from './HaloHalo'
import DisclaimerAlert from 'components/Header/DisclaimerAlert'
import Demo from './Test/Demo'
import TailwindDemo from './Test/TailwindDemo'
import Pool from './Tailwind/Pool'
import Swap from './Tailwind/Swap'
import { GeofenceCountry, useGeofence } from '../halo-hooks/useGeofence'
import GeoBlocked from 'components/Tailwind/Panels/GeoBlocked'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 50px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 16px;
    padding-top: 1rem;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  const { loading, rejected } = useGeofence(GeofenceCountry.PHILIPPINES)

  if (loading) {
    return <div>loading...</div>
  } else if (!loading && rejected) {
    return <GeoBlocked />
  }

  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <AppWrapper>
        <URLWarning />
        <DisclaimerAlert />
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <Popups />
          <Polling />
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/pool" component={Pool} />
              <Route exact strict path="/farm" component={Farm} />
              <Route path="/farm/:address" component={Farm} />
              <Route exact strict path="/vesting" component={HaloHalo} />
              <Route exact strict path="/swap" component={Swap} />
              {(process.env.NODE_ENV === 'development' || process.env.REACT_APP_SHOW_DEMO === 'true') && (
                <Route exact strict path="/demo" component={Demo} />
              )}
              {(process.env.NODE_ENV === 'development' || process.env.REACT_APP_SHOW_DEMO === 'true') && (
                <Route exact strict path="/tw-demo" component={TailwindDemo} />
              )}
              <Route component={RedirectPathToFarmOnly} />
            </Switch>
          </Web3ReactManager>
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}
