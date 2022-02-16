import React, { useState, useCallback, useEffect } from 'react'
import ReactGA from 'react-ga'
import { Pair } from '@halodao/sdk'
import styled from 'styled-components'
import { darken } from 'polished'

import { RowBetween } from '../../components/Row'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { CustomLightSpinner, TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import useTheme from '../../hooks/useTheme'

import useTokenBalance, { BalanceProps } from '../../sushi-hooks/queries/useTokenBalance'
import { formatFromBalance, formatToBalance } from '../../utils'
import { formatEther } from 'ethers/lib/utils'

import useHaloHalo from '../../halo-hooks/useHaloHalo'
import { HALO_TOKEN_ADDRESS } from '../../constants'
import { ButtonHalo, ButtonHaloStates, ButtonMax } from 'components/Button'
import { ErrorText } from 'components/Alerts'
import Column from 'components/Column'
import { useTranslation } from 'react-i18next'
import Spinner from '../../assets/images/spinner.svg'
import { ProviderErrorCode } from 'walletlink/dist/provider/Web3Provider'
import BaseModal from '../../components/Tailwind/Modals/BaseModal'
import ErrorContent from '../../components/Tailwind/ErrorContent/TransactionErrorContent'
import useErrorMessage from '../../halo-hooks/useErrorMessage'

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
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 20px 0 0 0;
  `};
`

const Container = styled.div<{ hideInput: boolean; cornerRadiusTopNone?: boolean; cornerRadiusBottomNone?: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '12px')};
  border-radius: ${({ cornerRadiusTopNone }) => cornerRadiusTopNone && '0 0 12px 12px'};
  border-radius: ${({ cornerRadiusBottomNone }) => cornerRadiusBottomNone && '12px 12px 0 0'};
  background-color: ${({ theme }) => theme.bg1};
`

interface CurrencyInputPanelProps {
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

export default function CurrencyInputPanel({
  label = 'Input',
  disableCurrencySelect = false,
  hideInput = false,
  id,
  cornerRadiusBottomNone,
  cornerRadiusTopNone
}: CurrencyInputPanelProps) {
  const { account, chainId } = useActiveWeb3React()
  const theme = useTheme()
  const { t } = useTranslation()
  const { allowance, approve, enter } = useHaloHalo()
  const haloBalanceBigInt = useTokenBalance(chainId ? HALO_TOKEN_ADDRESS[chainId] : ' ')
  const haloBalance = formatFromBalance(haloBalanceBigInt?.value, haloBalanceBigInt?.decimals)
  const decimals = haloBalanceBigInt?.decimals
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [depositValue, setDepositValue] = useState('')
  const [maxSelected, setMaxSelected] = useState(false)
  const maxDepositAmountInput = haloBalanceBigInt
  const [buttonState, setButtonState] = useState(ButtonHaloStates.Disabled)
  const [hasError, sethasError] = useState(false)
  const { message, getErrorMessage } = useErrorMessage()
  const [objectErrorMessage, setObjectErrorMessage] = useState({
    code: 0,
    data: '',
    message: ''
  })

  // Updating the state of stake button
  useEffect(() => {
    if (pendingTx) return

    const depositAsFloat = parseFloat(depositValue)
    if (depositAsFloat > 0 && depositAsFloat <= parseFloat(haloBalance)) {
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
  }, [allowance, depositValue, haloBalance, pendingTx, requestedApproval])

  // handle approval
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await approve()
      // user rejected tx or didn't go thru
      if (
        txHash.code === ProviderErrorCode.USER_DENIED_REQUEST_ACCOUNTS ||
        txHash.code === ProviderErrorCode.USER_DENIED_REQUEST_SIGNATURE
      ) {
        console.clear()
        getErrorMessage({
          code: txHash.code,
          data: '',
          message: txHash.message
        })
        setObjectErrorMessage({
          code: txHash.code,
          data: '',
          message: txHash.message
        })
        setRequestedApproval(false)
        sethasError(true)
      } else {
        await txHash.wait()
        setRequestedApproval(true)
        sethasError(false)
      }
    } catch (e) {
      console.error(e)
      console.clear()
      setRequestedApproval(false)
      sethasError(true)
      const shortedMessage = e.data.message
      getErrorMessage({
        code: e.data.code,
        data: e.data.data,
        message: shortedMessage?.replace(/^([^ ]+ ){2}/, '')
      })
      setObjectErrorMessage({
        code: e.data.code,
        data: e.data.data,
        message: shortedMessage?.replace(/^([^ ]+ ){2}/, '')
      })
    }
  }, [approve, setRequestedApproval])

  // track and parse user input for Deposit Input
  const onUserDepositInput = useCallback((depositValue: string, max = false) => {
    setMaxSelected(max)
    setDepositValue(depositValue)
  }, [])

  // used for max input button
  const handleMaxDeposit = useCallback(() => {
    maxDepositAmountInput && onUserDepositInput(haloBalance, true)
  }, [maxDepositAmountInput, onUserDepositInput, haloBalance])

  // handles actual deposit
  const deposit = async () => {
    setPendingTx(true)
    setButtonState(ButtonHaloStates.TxInProgress)

    let amount: BalanceProps | undefined
    if (maxSelected) {
      amount = maxDepositAmountInput
    } else {
      amount = formatToBalance(depositValue, decimals)
    }
    try {
      const tx = await enter(amount)
      if (
        tx.code === ProviderErrorCode.USER_DENIED_REQUEST_ACCOUNTS ||
        tx.code === ProviderErrorCode.USER_DENIED_REQUEST_SIGNATURE
      ) {
        setObjectErrorMessage(tx)
        setPendingTx(false)
        setButtonState(ButtonHaloStates.Disabled)
        sethasError(true)
      } else {
        await tx.wait()
        setPendingTx(false)
        setButtonState(ButtonHaloStates.Disabled)
        setDepositValue('')
        sethasError(false)
      }
    } catch (e) {
      console.error(e)
      console.clear()
      setPendingTx(false)
      setButtonState(ButtonHaloStates.Disabled)
      sethasError(true)
      setObjectErrorMessage(e.data)
    }
    /** log deposit in GA
     */
    ReactGA.event({
      category: 'Vest',
      action: 'Deposit',
      label: account ? 'User Address: ' + account : '',
      value: parseFloat(formatEther(amount.value.toString()))
    })
  }

  return (
    <>
      {/* Deposit Input */}
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
                    onClick={handleMaxDeposit}
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
                    BALANCE: {haloBalance} RNBW
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
                  value={depositValue}
                  onUserInput={val => {
                    onUserDepositInput(val)
                  }}
                />
                {account && label !== 'To' && <ButtonMax onClick={handleMaxDeposit}>{t('max')}</ButtonMax>}
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
              id="deposit-button"
              disabled={[ButtonHaloStates.Disabled, ButtonHaloStates.Approving, ButtonHaloStates.TxInProgress].includes(
                buttonState
              )}
              onClick={async () => {
                if (buttonState === ButtonHaloStates.Approved) {
                  deposit()
                } else {
                  handleApprove()
                }
              }}
            >
              {(buttonState === ButtonHaloStates.Disabled || buttonState === ButtonHaloStates.Approved) && (
                <>{t('deposit')}</>
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
                  {t('deposit')}&nbsp;
                  <CustomLightSpinner src={Spinner} alt="loader" size={'15px'} />{' '}
                </>
              )}
            </ButtonHalo>
            {parseFloat(depositValue) > 0 && parseFloat(depositValue) > parseFloat(haloBalance) && (
              <ErrorText>{t('insufficientFunds')}</ErrorText>
            )}
          </Column>
        </Container>
        {hasError && <span style={{ color: 'red' }}>Open an error modal!</span>}
      </InputPanel>
      {hasError && (
        <BaseModal
          isVisible={hasError}
          onDismiss={() => {
            sethasError(false)
          }}
        >
          {
            <ErrorContent
              objectError={objectErrorMessage}
              onDismiss={() => {
                sethasError(false)
              }}
            />
          }
        </BaseModal>
      )}
    </>
  )
}
