import { TokenAmount, Currency } from '@sushiswap/sdk'
import React, { useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Logo from '../../assets/svg/logo.svg'
import Hamburger from '../../assets/svg/hamburger-menu.svg'
import Close from '../../assets/images/x.svg'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances, useTokenBalance } from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
import { CountUp } from 'use-count-up'
import { ExternalLink, HideMedium, TYPE } from '../../theme'
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 1rem;
  z-index: 3;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0.75rem 1rem;
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
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
    display: none;
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
  margin-right: 1.5rem;
  text-decoration: none;

  :hover {
    cursor: pointer;
  }

  .site-logo {
    width: 40px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-self: center;

    .site-logo {
      width: 26px;
    }
  `};
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
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1.5rem;
  width: fit-content;
  margin: 4px 15px 0;
  padding: 1.25rem 0;
  font-weight: 400;
  font-family: 'Fredoka One', cursive;
  border-bottom: 4px solid transparent;

  &.${activeClassName} {
    color: ${({ theme }) => theme.primaryText1};
    border-color: ${({ theme }) => theme.primaryText1};
  }

  :hover {
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
  margin: 4px 15px 0;
  font-weight: 400;
  font-family: 'Fredoka One', cursive;
  border-bottom: 4px solid transparent;

  &.${activeClassName} {
    border-radius: ${({ theme }) => theme.borderRadius};
    font-weight: 600;
  }

  :hover {
    color: ${({ theme }) => theme.primaryText1};
    text-decoration: none;
  }

  :focus {
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

export const MobileTitle = styled.div`
  display: none;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
    margin-left: 0.5rem;
    font-size: 1.5rem;
    font-weight: 400;
    font-family: 'Fredoka One';
    color: ${({ theme }) => theme.primaryText1};
  `};

  ${({ theme }) => theme.mediaWidth.upToExtra2Small`
    display: none;
  `};
`

export const HamburgerButton = styled.button`
  display: none;

  img {
    width: 18px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
    margin-right: 1rem;
    padding: 0.25rem;
    background-color: transparent;
    border: 0;
  `};
`

export const DrawerFrame = styled.div`
  display: none;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
    margin-left: -100vw;
    transition: margin 0.25s;
    position: absolute;
    width: 100vw;
    height: 100%;
    z-index: 2;

    &.active {
      margin-left: 0;
    }
  `};
`

export const DrawerContent = styled.div`
  width: 80%;
  height: 100%;
  max-width: 400px;
  background-color: white;
  position: absolute;
  top: 0;
`

export const DrawerBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #333333;
  opacity: 0.3;
  display: none;
  z-index: 2;

  &.active {
    display: block;
  }
`

export const DrawerMenu = styled.div`
  padding: 1rem;
  margin-top: 65px;
  display: flex;
  flex-direction: column;

  a {
    font-size: 1.25rem;
    font-weight: 400;
    font-family: 'Fredoka One';
    text-decoration: none;
    color: ${({ theme }) => theme.text1};
    padding: 0.5rem 1rem;
    border-radius: 10px;
  }

  a.active {
    color: white;
    background-color: ${({ theme }) => theme.primary1};
  }
`

export const MenuItem = styled.div`
  padding: 1rem;
`

export const DrawerFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  .more-menu {
  }
`

export default function Header() {
  const { t } = useTranslation()
  const { account, chainId, library } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible)
  }

  return (
    <>
      <HeaderFrame>
        {/* RNBW balance modal */}
        <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
          <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
        </Modal>

        <HeaderRow>
          {/* [Mobile] Hamburger button */}
          <HamburgerButton>
            <img src={isDrawerVisible ? Close : Hamburger} alt="hamburger icon" onClick={toggleDrawer} />
          </HamburgerButton>

          {/* Site title & logo */}
          <Title href=".">
            <HoverIcon>
              <img className="site-logo" src={Logo} alt="logo" />
            </HoverIcon>
            <MobileTitle>HaloDAO</MobileTitle>
          </Title>

          {/* Main menu */}
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
                'https://app.balancer.fi/#/trade/0x70e8de73ce538da2beed35d14187f6959a8eca96/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
              }
            >
              {t('swap')}
            </StyledExternalLink>
            <StyledExternalLink id={`vote-nav-link`} href={'https://snapshot.org/#/halodao.eth'}>
              {t('vote')}
            </StyledExternalLink>
          </HeaderLinks>
        </HeaderRow>

        {/* [Mobile] ETH balance / Connect button */}
        <HideMedium>
          <Web3Status shorten={true} />
        </HideMedium>

        {/* [Desktop] Right-side of navbar */}
        <HeaderControls>
          <HeaderElement>
            {/* Chain Network */}
            <HideSmall>{chainId && <Web3Network />}</HideSmall>
            {library && library.provider.isMetaMask && (
              <AccountElement active={true} style={{ pointerEvents: 'auto' }}></AccountElement>
            )}

            {/* RNBW Balance */}
            <RNBWBalance onClickHandler={() => setShowUniBalanceModal(true)} />

            {/* ETH balance + wallet address  */}
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && chainId && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} {Currency.getNativeCurrencySymbol(chainId)}
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>

          {/* More menu */}
          <HeaderElementWrap>
            <Menu />
          </HeaderElementWrap>
        </HeaderControls>
      </HeaderFrame>

      {/* [Mobile] App Drawer */}
      <DrawerBackdrop className={isDrawerVisible ? 'active' : 'inactive'} onClick={toggleDrawer} />
      <DrawerFrame className={isDrawerVisible ? 'active' : 'inactive'}>
        <DrawerContent>
          <DrawerMenu>
            <MainMenu onClick={toggleDrawer} />
          </DrawerMenu>
          <DrawerFooter>
            <RNBWBalance onClickHandler={() => setShowUniBalanceModal(true)} />
            <div className="more-menu">
              <Menu />
            </div>
          </DrawerFooter>
        </DrawerContent>
      </DrawerFrame>
    </>
  )
}

interface MainMenuProps {
  onClick: () => void
}

export const MainMenu = ({ onClick }: MainMenuProps) => {
  const { t } = useTranslation()

  return (
    <>
      <MenuItem>
        <NavLink
          id={`farm-nav-link`}
          to={'/farm'}
          isActive={(match, { pathname }) => Boolean(match) || pathname === '/farm'}
          onClick={onClick}
        >
          {t('farm')}
        </NavLink>
      </MenuItem>
      <MenuItem>
        <NavLink id={`vesting-nav-link`} to={'/vesting'} onClick={onClick}>
          {t('vesting')}
        </NavLink>
      </MenuItem>
      <MenuItem>
        <span onClick={onClick}>
          <ExternalLink
            id={`swap-nav-link`}
            href={
              'https://app.balancer.fi/#/trade/0x70e8de73ce538da2beed35d14187f6959a8eca96/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
            }
          >
            {t('swap')}
          </ExternalLink>
        </span>
      </MenuItem>
      <MenuItem>
        <span onClick={onClick}>
          <ExternalLink id={`vote-nav-link`} href={'https://snapshot.org/#/halodao.eth'}>
            {t('vote')}
          </ExternalLink>
        </span>
      </MenuItem>
    </>
  )
}

interface RNBWBalanceProps {
  onClickHandler: () => void
}

export const RNBWBalance = ({ onClickHandler }: RNBWBalanceProps) => {
  const { account, chainId } = useActiveWeb3React()
  const halo = chainId ? HALO[chainId] : undefined
  const haloBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, halo)
  const countUpValue = haloBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  return (
    <>
      {chainId && [1, 3, 4, 5, 42].includes(chainId) && (
        <UNIWrapper onClick={onClickHandler}>
          <UNIAmount active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && (
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
            )}
            RNBW
          </UNIAmount>
          <CardNoise />
        </UNIWrapper>
      )}
    </>
  )
}
