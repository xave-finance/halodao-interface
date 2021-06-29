import { TokenAmount, Currency } from '@sushiswap/sdk'
import React, { useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Logo from '../../assets/svg/logo.svg'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances, useTokenBalance } from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
import { CountUp } from 'use-count-up'
import { ExternalLink, TYPE } from '../../theme'
import Menu from '../Menu'
import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import Modal from '../Modal'
import UniBalanceContent from './UniBalanceContent'
import usePrevious from '../../hooks/usePrevious'
import Web3Network from 'components/Web3Network'
import { HALO } from '../../constants'

const HeaderFrame = styled.div`
  background: #ffffff;
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 5px;
  `}
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row-reverse;
    align-items: center;

    & > *:not(:first-child) {
      margin-left: 4px;
    }
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: ${({ theme }) => theme.borderRadius};
  white-space: nowrap;
  width: 100%;
  cursor: pointer;
  :focus {
    border: 1px solid blue;
  }
`

const UNIAmount = styled(AccountElement)`
  background: ${({ theme }) => theme.haloGradient};
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 15px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const HoverIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1.5rem;
  width: fit-content;
  margin: 0 15px;
  font-weight: 400;
  font-family: 'Fredoka One', cursive;

  &.${activeClassName} {
    border-radius: ${({ theme }) => theme.borderRadius};
    font-weight: 200;
  }

  :hover,
  :focus {
    color: ${({ theme }) => theme.primaryText1};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
  `};
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1.5rem;
  width: fit-content;
  margin: 0 15px;
  font-weight: 400;
  font-family: 'Fredoka One', cursive;

  &.${activeClassName} {
    border-radius: ${({ theme }) => theme.borderRadius};
    font-weight: 600;
  }

  :hover,
  :focus {
    color: ${({ theme }) => theme.primaryText1};
    text-decoration: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
  `};
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: 4px;
  `};
`

export default function Header() {
  const { account, chainId, library } = useActiveWeb3React()
  const { t } = useTranslation()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const halo = chainId ? HALO[chainId] : undefined
  const haloBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, halo)
  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const countUpValue = haloBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  return (
    <HeaderFrame>
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <HeaderRow>
        <Title href=".">
          <HoverIcon>
            <img width={'40px'} src={Logo} alt="logo" />
          </HoverIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink
            id={`farm-nav-link`}
            to={'/farm'}
            isActive={(match, { pathname }) => Boolean(match) || pathname === '/farm'}
          >
            {t('farm')}
          </StyledNavLink>
          <StyledNavLink id={`vesting-nav-link`} to={'/vesting'}>
            {t('vesting')}
          </StyledNavLink>
          <StyledExternalLink
            id={`swap-nav-link`}
            href={
              'https://app.balancer.fi/#/trade/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/0x0000852600CEB001E08e00bC008be620d60031F2'
            }
          >
            {t('swap')}
          </StyledExternalLink>
          <StyledExternalLink id={`vote-nav-link`} href={'https://snapshot.org/#/halodao.eth'}>
            {t('vote')}
          </StyledExternalLink>
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>{chainId && <Web3Network />}</HideSmall>
          {library && library.provider.isMetaMask && (
            <AccountElement active={true} style={{ pointerEvents: 'auto' }}></AccountElement>
          )}
          {chainId && [1, 3, 4, 5, 42].includes(chainId) && (
            <UNIWrapper onClick={() => setShowUniBalanceModal(true)}>
              <UNIAmount active={!!account} style={{ pointerEvents: 'auto' }}>
                {account && (
                  <HideSmall>
                    <TYPE.white
                      style={{
                        paddingRight: '.4rem'
                      }}
                    >
                      <CountUp
                        key={countUpValue}
                        isCounting
                        start={parseFloat(countUpValuePrevious)}
                        end={parseFloat(countUpValue)}
                        thousandsSeparator={','}
                        duration={1}
                      />
                    </TYPE.white>
                  </HideSmall>
                )}
                RNBW
              </UNIAmount>
              <CardNoise />
            </UNIWrapper>
          )}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && chainId && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} {Currency.getNativeCurrencySymbol(chainId)}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
