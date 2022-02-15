import React from 'react'
import EpochCharacter from '../../../assets/svg/epochCharacter.svg'
import GradientCard from '../../Card/GradientCard'
import styled from 'styled-components'
import { CurrentEpoch } from '../../../halo-hooks/useEpochCountdown'

interface TimeObject {
  event: boolean
  content: Record<string, string>
  countdown?: CurrentEpoch
}

const EventInfoCard = ({ event, content, countdown }: TimeObject) => {
  const Content = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
       justify-content: space-around;
       align-items: center;
       height: auto;
    `};
  `

  const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    & div:nth-child(2) {
      // Countdown Container Timer Style Here
    }
  `
  const Title = styled.p`
    font-weight: ${event ? 'normal' : '600'};
    font-size: ${event ? '16px' : '24px'};
    line-height: ${event ? '130%' : '33px'};
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        text-align: center
        font-size: 20px;
        margin-bottom: ${event ? '15px' : 'none'};
    `};
  `
  const CountDown = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 11px;
    & div {
      display: flex;
      flex-direction: column;
      width: 78px;
    }
    & p {
      font-weight: bold;
      font-size: 10px;
      line-height: 130%;
      text-align: center;
    }
    & h2 {
      font-family: Fredoka One;
      font-weight: normal;
      font-size: 60px;
      line-height: 73px;
      color: #ffd654;
      text-align: center;
    }
  `
  const Image = styled.img`
    max-width: 162.48px;
    width: 100%;
    height: 155.61px;
    display: block;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        display: none;
    `};
  `
  const Footer = styled.div`
    margin-top: 18px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      flex-direction: column;
      gap: 4px;
  `};
  `
  const FooterChildContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        gap: 4px;
        justify-content: center;
        align-items: center;
    `};

    & p {
      font-weight: bold;
      font-size: 10px;
      line-height: 130%;
    }
    & h4 {
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
      ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        font-size: 24px;
        text-align: center;
      `};
    }
  `
  const Price = styled.h2`
    font-family: Fredoka One;
    font-weight: normal;
    font-size: 35px;
    line-height: 73px;
    color: #ffd654;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        text-align: center
    `};
  `
  const ConvertToString = (x: any) => {
    return x.toString()
  }
  const IfDoubleDigit = (str: string) => {
    const strLength = str.length
    return strLength === 1
  }
  return (
    <>
      <GradientCard>
        <Content>
          <ContentContainer>
            {event ? (
              <>
                <Title>{content.title}</Title>
                <CountDown>
                  <div>
                    <p>Days</p>
                    <h2>{IfDoubleDigit(ConvertToString(countdown?.days)) ? `0${countdown?.days}` : countdown?.days}</h2>
                  </div>
                  <div>
                    <p>Hours</p>
                    <h2>
                      <h2>
                        {' '}
                        {IfDoubleDigit(ConvertToString(countdown?.hours)) ? `0${countdown?.hours}` : countdown?.hours}
                      </h2>
                    </h2>
                  </div>
                  <div>
                    <p>Minutes</p>
                    <h2>
                      {IfDoubleDigit(ConvertToString(countdown?.minutes))
                        ? `0${countdown?.minutes}`
                        : countdown?.minutes}
                    </h2>
                  </div>
                  {/*<div>*/}
                  {/*  <p>Seconds</p>*/}
                  {/*  <h2>{countdown?.seconds}</h2>*/}
                  {/*</div>*/}
                </CountDown>
              </>
            ) : (
              <>
                <Title>{content.title}</Title>
                <Price>{content?.liquidity}</Price>
              </>
            )}
          </ContentContainer>
          <Image src={EpochCharacter} />
        </Content>
        <Footer>
          <FooterChildContainer>
            <p>DEPOSIT IN POOL </p>
            <h4>{content.deposit}</h4>
          </FooterChildContainer>
          <FooterChildContainer>
            <p>MONTHLY PROFITS </p>
            <h4>{content.profit}</h4>
          </FooterChildContainer>
        </Footer>
      </GradientCard>
    </>
  )
}

export default EventInfoCard
