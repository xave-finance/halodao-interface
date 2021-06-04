import React, { useState, useCallback, useEffect } from 'react'
import { Pair } from '@sushiswap/sdk'
import styled from 'styled-components'
import { darken } from 'polished'

import { RowBetween } from '../../components/Row'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { CustomLightSpinner, TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import useTheme from '../../hooks/useTheme'

import useTokenBalance, { BalanceProps } from '../../sushi-hooks/queries/useTokenBalance'
import { formatFromBalance, formatToBalance } from '../../utils'

import useHaloHalo from '../../halo-hooks/useHaloHalo'
import { HALOHALO_ADDRESS } from '../../constants'
import { ButtonHalo, ButtonHaloStates, ButtonMax } from 'components/Button'
import { useTranslation } from 'react-i18next'
import Spinner from '../../assets/images/spinner.svg'
import { ErrorText } from 'components/Alerts'
import Column from 'components/Column'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: #ffffff;
  z-index: 1;
  margin: 30px 0 0 0;
`

const Container = styled.div<{ hideInput: boolean; cornerRadiusTopNone?: boolean; cornerRadiusBottomNone?: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '12px')};
  border-radius: ${({ cornerRadiusTopNone }) => cornerRadiusTopNone && '0 0 12px 12px'};
  border-radius: ${({ cornerRadiusBottomNone }) => cornerRadiusBottomNone && '12px 12px 0 0'};
  background-color: ${({ theme }) => theme.bg1};
`

const StyledBalanceMax = styled.button`
  height: 28px;
  padding-right: 8px;
  padding-left: 8px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

interface HaloHaloWithdrawPanelProps {
  label?: string
  lpTokenAddress?: string
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  id: string
  customBalanceText?: string
  buttonText?: string
  cornerRadiusBottomNone?: boolean
  cornerRadiusTopNone?: boolean
}

export default function HaloHaloWithdrawPanel({
  label = 'Input',
  disableCurrencySelect = false,
  hideInput = false,
  id,
  cornerRadiusBottomNone,
  cornerRadiusTopNone
}: HaloHaloWithdrawPanelProps) {
  const { account, chainId } = useActiveWeb3React()
  const theme = useTheme()
  const { t } = useTranslation()
  const { allowance, approve, leave } = useHaloHalo()
  const xHaloHaloBalanceBigInt = useTokenBalance(chainId ? HALOHALO_ADDRESS[chainId] : ' ')
  const xHaloHaloBalance = formatFromBalance(xHaloHaloBalanceBigInt?.value, xHaloHaloBalanceBigInt?.decimals)
  const decimals = xHaloHaloBalanceBigInt?.decimals
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [withdrawValue, setWithdrawValue] = useState('')
  const [maxSelected, setMaxSelected] = useState(false)
  const maxWithdrawAmountInput = xHaloHaloBalanceBigInt
  const [buttonState, setButtonState] = useState(ButtonHaloStates.Disabled)

  // Updating the state of stake button
  useEffect(() => {
    if (pendingTx) return

    const withdrawAsFloat = parseFloat(withdrawValue)
    if (withdrawAsFloat > 0 && withdrawAsFloat <= parseFloat(xHaloHaloBalance)) {
      if (allowance !== '' && parseFloat(allowance) > 0) {
        setButtonState(ButtonHaloStates.Approved)
      } else if (requestedApproval) {
        setButtonState(ButtonHaloStates.Approving)
      } else {
        setButtonState(ButtonHaloStates.NotApproved)
      }
    } else {
      setButtonState(ButtonHaloStates.Disabled)
    }
  }, [allowance, withdrawValue, xHaloHaloBalance, pendingTx, requestedApproval])

  // handle approval
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await approve()
      console.log(txHash)
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [approve, setRequestedApproval])

  // track and parse user input for Deposit Input
  const onUserWithdrawInput = useCallback((withdrawValue: string, max = false) => {
    setMaxSelected(max)
    setWithdrawValue(withdrawValue)
  }, [])

  // used for max input button
  const handleMaxWithdraw = useCallback(() => {
    maxWithdrawAmountInput && onUserWithdrawInput(xHaloHaloBalance, true)
  }, [maxWithdrawAmountInput, onUserWithdrawInput, xHaloHaloBalance])

  // handles actual withdrawal
  const withdraw = async () => {
    setPendingTx(true)
    setButtonState(ButtonHaloStates.TxInProgress)

    let amount: BalanceProps | undefined
    if (maxSelected) {
      amount = maxWithdrawAmountInput
    } else {
      amount = formatToBalance(withdrawValue, decimals)
    }
    try {
      const tx = await leave(amount)
      await tx.wait()
    } catch (e) {
      console.log(e)
    }
    setPendingTx(false)
    setButtonState(ButtonHaloStates.Disabled)
    setWithdrawValue('')
  }

  return (
    <>
      <InputPanel id={id}>
        <Container
          hideInput={hideInput}
          cornerRadiusBottomNone={cornerRadiusBottomNone}
          cornerRadiusTopNone={cornerRadiusTopNone}
        >
          {!hideInput && (
            <LabelRow
              style={{
                padding: 0
              }}
            >
              <RowBetween
                style={{
                  display: 'block'
                }}
              >
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  {label}
                </TYPE.body>
                {account && (
                  <TYPE.body
                    onClick={handleMaxWithdraw}
                    style={{
                      cursor: 'pointer',
                      fontFamily: 'Open Sans',
                      fontStyle: 'normal',
                      fontWeight: 800,
                      lineHeight: '16px',
                      letterSpacing: '0.2em',
                      color: '#000000'
                    }}
                  >
                    BALANCE: {xHaloHaloBalance} RNBW
                  </TYPE.body>
                )}
              </RowBetween>
            </LabelRow>
          )}
          <InputRow
            style={
              hideInput
                ? {
                    padding: '4px 0 0 0',
                    borderRadius: '8px'
                  }
                : {
                    padding: '4px 0 0 0'
                  }
            }
            selected={disableCurrencySelect}
          >
            {!hideInput && (
              <>
                <NumericalInput
                  className="token-amount-input"
                  value={withdrawValue}
                  onUserInput={val => {
                    onUserWithdrawInput(val)
                  }}
                />
                {account && label !== 'To' && <ButtonMax onClick={handleMaxWithdraw}>{t('max')}</ButtonMax>}
              </>
            )}
          </InputRow>
          <Column
            style={
              hideInput
                ? {
                    padding: '4px 0 0 0',
                    borderRadius: '8px'
                  }
                : {
                    padding: '4px 0 0 0'
                  }
            }
          >
            <ButtonHalo
              id="withdraw-button"
              disabled={[ButtonHaloStates.Disabled, ButtonHaloStates.Approving, ButtonHaloStates.TxInProgress].includes(
                buttonState
              )}
              onClick={async () => {
                if (buttonState === ButtonHaloStates.Approved) {
                  withdraw()
                } else {
                  handleApprove()
                }
              }}
            >
              {(buttonState === ButtonHaloStates.Disabled || buttonState === ButtonHaloStates.Approved) && (
                <>{t('claimHalo')}</>
              )}
              {buttonState === ButtonHaloStates.NotApproved && <>{t('approve')}</>}
              {buttonState === ButtonHaloStates.Approving && (
                <>
                  {t('approving')}&nbsp;
                  <CustomLightSpinner src={Spinner} alt="loader" size={'15px'} />{' '}
                </>
              )}
              {buttonState === ButtonHaloStates.TxInProgress && (
                <>
                  {t('claimHalo')}&nbsp;
                  <CustomLightSpinner src={Spinner} alt="loader" size={'15px'} />{' '}
                </>
              )}
            </ButtonHalo>
            {parseFloat(withdrawValue) > 0 && parseFloat(withdrawValue) > parseFloat(xHaloHaloBalance) && (
              <ErrorText>{t('insufficientFunds')}</ErrorText>
            )}
          </Column>
        </Container>
      </InputPanel>
    </>
  )
}
