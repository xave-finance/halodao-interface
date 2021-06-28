import React from 'react'
import styled from 'styled-components'
import Column, { AutoColumn } from 'components/Column'
import { Button, ButtonText, CloseIcon, colors, TYPE } from 'theme'
import { RowBetween, RowFixed } from 'components/Row'
import {
  ButtonHalo,
  ButtonHaloOutlined,
  ButtonHaloWhite,
  ButtonOutlined,
  ButtonPrimary,
  ButtonPrimaryNormal,
  ButtonSecondary
} from 'components/Button'
import Toggle from 'components/Toggle'
import { SwapPoolTabs } from 'components/NavigationTabs'

const themeColor = colors(false)

const StyledWrapper = styled(AutoColumn)`
  max-width: 820px;
  width: 100%;
  display: block;
`

const Demo = () => {
  const handleButtonClick = () => {
    console.log('button clicked!')
  }

  return (
    <StyledWrapper>
      <h1>App Theme</h1>

      <h2>Typography</h2>
      <Column>
        <TYPE.main>this is the main text</TYPE.main>
        <TYPE.link>this is the link text</TYPE.link>
        <TYPE.black>this is the black text</TYPE.black>
        <TYPE.white>this is the white text</TYPE.white>
        <TYPE.largeHeader>this is the largeHeader text</TYPE.largeHeader>
        <TYPE.mediumHeader>this is the mediumHeader text</TYPE.mediumHeader>
        <TYPE.subHeader>this is the subHeader text</TYPE.subHeader>
        <TYPE.error error={true}>this is the error text (error=true)</TYPE.error>
        <TYPE.error error={false}>this is the error text (error=false)</TYPE.error>
        <TYPE.label>this is the label text</TYPE.label>
      </Column>

      <h2>Misc</h2>
      <RowBetween>
        <Column>
          <div>BorderRadius</div>
          <div>{themeColor.borderRadius}</div>
        </Column>
      </RowBetween>

      <h2>Colors</h2>
      <RowBetween marginBottom={10}>
        <div style={{ backgroundColor: themeColor.text1 }}>text1 {themeColor.text1}</div>
        <div style={{ backgroundColor: themeColor.text2 }}>text2 {themeColor.text2}</div>
        <div style={{ backgroundColor: themeColor.text3 }}>text3 {themeColor.text3}</div>
        <div style={{ backgroundColor: themeColor.text4 }}>text4 {themeColor.text4}</div>
        <div style={{ backgroundColor: themeColor.text5 }}>text5 {themeColor.text5}</div>
      </RowBetween>

      <RowBetween marginBottom={10}>
        <div style={{ backgroundColor: themeColor.bg1 }}>bg1 {themeColor.bg1}</div>
        <div style={{ backgroundColor: themeColor.bg2 }}>bg2 {themeColor.bg2}</div>
        <div style={{ backgroundColor: themeColor.bg3 }}>bg3 {themeColor.bg3}</div>
        <div style={{ backgroundColor: themeColor.bg4 }}>bg4 {themeColor.bg4}</div>
        <div style={{ backgroundColor: themeColor.bg5 }}>bg5 {themeColor.bg5}</div>
      </RowBetween>

      <RowBetween marginBottom={10}>
        <div style={{ backgroundColor: themeColor.primary1 }}>primary1 {themeColor.primary1}</div>
        <div style={{ backgroundColor: themeColor.primary2 }}>primary2 {themeColor.primary2}</div>
        <div style={{ backgroundColor: themeColor.primary3 }}>primary3 {themeColor.primary3}</div>
        <div style={{ backgroundColor: themeColor.primary4 }}>primary4 {themeColor.primary4}</div>
        <div style={{ backgroundColor: themeColor.primary5 }}>primary5 {themeColor.primary5}</div>
      </RowBetween>

      <RowBetween marginBottom={10}>
        <div style={{ backgroundColor: themeColor.modalBG }}>modalBG {themeColor.modalBG}</div>
        <div style={{ backgroundColor: themeColor.advancedBG }}>advancedBG {themeColor.advancedBG}</div>
        <div style={{ backgroundColor: themeColor.modalBGAlt }}>modalBGAlt {themeColor.modalBGAlt}</div>
        <div style={{ backgroundColor: themeColor.primaryText1 }}>primaryText1 {themeColor.primaryText1}</div>
      </RowBetween>

      <RowBetween>
        <div style={{ background: themeColor.haloGradient }}>haloGradient {themeColor.haloGradient}</div>
      </RowBetween>

      <h2>Component: Icons</h2>
      <RowBetween>
        <Column>
          <CloseIcon color={themeColor.primary1} onClick={handleButtonClick} />
          CloseIcon
        </Column>
      </RowBetween>

      <h2>Component: Buttons</h2>
      <RowFixed marginBottom={10}>
        <Button onClick={handleButtonClick}>Button</Button>
        <ButtonText onClick={handleButtonClick}>ButtonText</ButtonText>
      </RowFixed>
      <RowFixed marginBottom={10}>
        <ButtonPrimary onClick={handleButtonClick}>ButtonPrimary</ButtonPrimary>
        <ButtonPrimaryNormal onClick={handleButtonClick}>ButtonPrimaryNormal</ButtonPrimaryNormal>
        <ButtonOutlined onClick={handleButtonClick}>ButtonOutlined</ButtonOutlined>
      </RowFixed>
      <RowFixed>
        <ButtonSecondary onClick={handleButtonClick}>ButtonSecondary</ButtonSecondary>
      </RowFixed>

      <h2>Component: HALO buttons</h2>
      <RowFixed>
        <ButtonHalo onClick={handleButtonClick}>ButtonHalo</ButtonHalo>
        <ButtonHaloOutlined onClick={handleButtonClick}>ButtonHaloOutlined</ButtonHaloOutlined>
        <ButtonHaloWhite onClick={handleButtonClick}>ButtonHaloWhite</ButtonHaloWhite>
      </RowFixed>

      <h2>Component: Misc</h2>
      <RowFixed marginBottom={10}>
        <Toggle id="toggle-expert-mode-button" isActive={false} toggle={() => {}} />
      </RowFixed>
      <RowFixed>
        <SwapPoolTabs active={'swap'} />
      </RowFixed>
    </StyledWrapper>
  )
}

export default Demo
