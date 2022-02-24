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
import { Text } from 'rebass'

import { SUPPORTED_WALLETS } from '../../constants'

import Option from './Option'
import PendingView from '../WalletModal/PendingView'
import Modal from '../Modal'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { ExternalLink } from '../../theme'

const ContentWrapper = styled.div`
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const UpperSection = styled.div`
  position: relative;
  width: 100%;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`
const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
  border-bottom: 1px solid ${({ theme }) => theme.bg3};
`

const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`

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

const TitleText = styled(Text)`
  font-size: 36px;
  font-weight: 600;
  line-height: 130%;
  justify-self: flex-start;
  text-align: center;
`

const SubTitleText = styled(Text)`
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
  color: #333333;
  justify-self: flex-start;
  text-align: center;
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

const EmptyState = ({
  header,
  subHeader,
  loading,
  walletLoading
}: {
  header?: string
  subHeader?: string
  loading: boolean
  walletLoading: (value: boolean) => void
}) => {
  const { connector, activate } = useWeb3React()
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()
  const [pendingError, setPendingError] = useState<boolean>()

  const handleLoading = (value: boolean) => {
    walletLoading(value)
  }

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
    const walletFunction = async () => {
      connector &&
        (await activate(connector, undefined, true).catch(error => {
          if (error instanceof UnsupportedChainIdError) {
            activate(connector) // a little janky...can't use setError because the connector isn't set
            console.log('aspdoaspok')
          } else {
            setPendingError(true)
          }
        }))
    }
    walletFunction().then(() => {
      handleLoading(false)
    })
  }
  // get wallets user can switch too, depending on device/browser\
  const getOptions = () => {
    // function getOptions() {
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
                if (option.name === 'Fortmatic' || option.name === 'Portis') {
                  handleLoading(true)
                }
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
              if (option.name === 'Fortmatic' || option.name === 'Portis') {
                handleLoading(true)
              }
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
  const Web2Status = () => {
    const { account, error } = useWeb3React()

    if (!account && !error) {
      return (
        <>
          <Modal
            isOpen={loading}
            onDismiss={() => {
              walletLoading(false)
            }}
            minHeight={false}
            maxHeight={90}
          >
            <UpperSection>
              <ContentWrapper>
                <PendingView
                  connector={pendingWallet}
                  error={false}
                  setPendingError={setPendingError}
                  tryActivation={tryActivation}
                />
              </ContentWrapper>
            </UpperSection>
          </Modal>
          <MainRow>
            <TitleRow>
              <TitleText>{header}</TitleText>
            </TitleRow>
            <SubTitleRow>
              <SubTitleText>{subHeader}</SubTitleText>
            </SubTitleRow>
            <WalletRow>{getOptions()}</WalletRow>
            <Blurb style={{ lineHeight: '130%' }}>
              <span>New to Ethereum? &nbsp;</span>{' '}
              <ExternalLink href="https://ethereum.org/wallets/">Learn more about wallets</ExternalLink>
            </Blurb>
          </MainRow>
        </>
      )
    } else {
      return <></>
    }
  }

  return <Web2Status />
}

export default EmptyState
