import React from 'react'
import styled from 'styled-components'
import gradientSvg from '../../../src/assets/svg/Ellipse-17.svg'

interface GradientCardProps {
  title: string
  value: string
  header: boolean
}

const GradientCard = ({ title, value, header }: GradientCardProps) => {
  const gradiantBackground = gradientSvg
  const GradientDiv = styled.div`
    width: 100%;
    height: 100%;
    background: url(${gradiantBackground});
    background-size: contain;
    background-position: bottom -25px right -55px;
    ${({ theme }) => theme.mediaWidth.upToSmall`  
      background-position: bottom -15px right -35px;
    `};
    filter: grayscale(10%);
    background-repeat: no-repeat;
    padding: ${header ? 'none' : '8px'};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    ${({ theme }) => theme.mediaWidth.upToSmall`  
      justify-content: flex-start;
    `};
    border-radius: 6px;
    border: 1px solid #471bb2;
    position: ${header ? 'relative' : 'unset'};
  `
  const GradientCardLabel = styled.h4`
    font-size: ${header ? '9px' : '14px'};
    text-align: ${header ? 'center' : 'unset'};
    text-transform: uppercase;
    color: ${header ? 'white' : '#471bb2'};
    font-weight: ${header ? 'bold' : '600'};
    background: ${header ? '#471bb2' : 'none'};
    position: ${header ? 'absolute' : 'unset'};
    border-top-left-radius: ${header ? '5px' : 'none'};
    border-top-right-radius: ${header ? '5px' : 'none'};
    width: ${header ? '100%' : 'unset'};
    padding: ${header ? '8px' : 'unset'};
    ${({ theme }) => theme.mediaWidth.upToSmall`  
       font-size: unset;
       text-align: unset;
       background: unset;
       color: unset;
       font-size: ${header && '14px'};
       text-align: ${header ? 'left' : 'unset'};
       background: ${header && 'white'};
       color: ${header && '#471bb2'};
    `};
  `
  const GradientCardValue = styled.h5`
    font-size: 21px;
    font-weight: bold;
    position: ${header ? 'absolute' : 'unset'};
    padding: ${header ? '8px' : 'unset'};
    bottom: ${header ? '0px' : 'none'};
    ${({ theme }) => theme.mediaWidth.upToSmall`  
       bottom: unset;
       bottom: ${header && '-5px'};
    `};
  `
  return (
    <GradientDiv>
      <GradientCardLabel>{title ? title : 'Lorem Ipsum'}</GradientCardLabel>
      <GradientCardValue>{value ? value : '--------'}</GradientCardValue>
    </GradientDiv>
  )
}

export default GradientCard
