import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import React, { useState } from 'react'
import { isMobile } from 'react-device-detect'
import ReactGA from 'react-ga'
import { injected, portis } from '../../connectors'

import Row from '../Row'
import { RowBetween } from 'components/Row'
import styled from 'styled-components'
import { TYPE } from 'theme'
import { ExternalLink } from '../../theme'

import { SUPPORTED_WALLETS } from '../../constants'

import Option from './Option'

const WalletRow = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    flex-direction: column;
    flex-wrap: nowrap;
  `};
  flex-direction: row;
  flex-wrap: wrap;
  align-items: start;
`
const MainRow = styled(Row)`
  flex-direction: column;
  padding-left: 4rem;
  padding-right: 4rem;
`

const TitleRow = styled(RowBetween)`
  font-family: 'Fredoka One', cursive;
  margin-top: 2.5rem;
  padding-bottom: 2px;
  background: linear-gradient(to right top, #15006d 0%, #5521b6 50%, #2db7c4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  justify-content: center;
`

const SubTitleRow = styled(RowBetween)`
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const Blurb = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  font-size: 14px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 1rem;
  `};
`

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending'
}

const EmptyState = ({ header, subHeader }: { header?: string; subHeader?: string }) => {
  const { connector, activate } = useWeb3React()
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()

  const [pendingError, setPendingError] = useState<boolean>()

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    let name = ''
    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })
    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name
    })
    setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined
    }

    connector &&
      activate(connector, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector) // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true)
        }
      })
  }

  function Web2Status() {
    const { account, error } = useWeb3React()
    if (!account && !error) {
      return (
        <MainRow>
          <TitleRow>
            <TYPE.largeHeader>{header}</TYPE.largeHeader>
          </TitleRow>
          <SubTitleRow>
            <TYPE.darkGray style={{ fontSize: '12px', lineHeight: '130%' }}>{subHeader}</TYPE.darkGray>
          </SubTitleRow>
          <WalletRow>{getOptions()}</WalletRow>
          <Blurb style={{ lineHeight: '130%' }}>
            <span>New to Ethereum? &nbsp;</span>{' '}
            <ExternalLink href="https://ethereum.org/wallets/">Learn more about wallets</ExternalLink>
          </Blurb>
        </MainRow>
      )
    } else {
      return <></>
    }
  }
  // get wallets user can switch too, depending on device/browser\
  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key]

      // check for mobile options
      if (isMobile) {
        //disable portis on mobile for now
        if (option.connector === portis) {
          return null
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => {
                option.connector !== connector && !option.href && tryActivation(option.connector)
              }}
              id={`connect-${key}`}
              key={key}
              link={option.href}
              header={option.name}
              icon={require('../../assets/images/' + option.iconName)}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return <div></div>
          } else {
            return null //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector)
            }}
            key={key}
            link={option.href}
            header={option.name}
            icon={require('../../assets/images/' + option.iconName)}
          />
        )
      )
    })
  }

  return <Web2Status />
}

export default EmptyState
