import React, { useState, useCallback, useEffect } from 'react'
import ReactGA from 'react-ga'
import { Pair } from '@halodao/sdk'
import { ProviderErrorCode } from 'walletlink/dist/provider/Web3Provider'
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
import useErrorMessage from '../../halo-hooks/useErrorMessage'
import BaseModal from '../../components/Tailwind/Modals/BaseModal'
import ErrorContent from '../../components/Tailwind/ErrorContent/TransactionErrorContent'
import { HALOHALO_ADDRESS } from '../../constants'
import { ButtonHalo, ButtonHaloStates, ButtonMax } from 'components/Button'
import { useTranslation } from 'react-i18next'
import Spinner from '../../assets/images/spinner.svg'
import { ErrorText } from 'components/Alerts'
import Column from 'components/Column'
import { formatNumber, NumberFormat } from 'utils/formatNumber'

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
  const { allowance, approve, leave, haloHaloPrice } = useHaloHalo()
  const xHaloHaloBalanceBigInt = useTokenBalance(chainId ? HALOHALO_ADDRESS[chainId] : ' ')
  const xHaloHaloBalance = formatFromBalance(xHaloHaloBalanceBigInt?.value, xHaloHaloBalanceBigInt?.decimals)
  const decimals = xHaloHaloBalanceBigInt?.decimals
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [withdrawValue, setWithdrawValue] = useState('')
  const [maxSelected, setMaxSelected] = useState(false)
  const maxWithdrawAmountInput = xHaloHaloBalanceBigInt
  const [buttonState, setButtonState] = useState(ButtonHaloStates.Disabled)
  const [haloToClaim, setHaloToClaim] = useState(0)
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
      if (
        // catch metamask rejection
        txHash.code === ProviderErrorCode.USER_DENIED_REQUEST_ACCOUNTS ||
        txHash.code === ProviderErrorCode.USER_DENIED_REQUEST_SIGNATURE
      ) {
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
      console.log(e)
    }
  }, [approve, setRequestedApproval])

  // track and parse user input for Deposit Input
  const onUserWithdrawInput = useCallback(
    (withdrawValue: string, max = false) => {
      setMaxSelected(max)
      setWithdrawValue(withdrawValue)
      setHaloToClaim(parseFloat(withdrawValue) * parseFloat(haloHaloPrice))
    },
    [haloHaloPrice]
  )

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
      // await tx.wait()
      if (
        tx.code === ProviderErrorCode.USER_DENIED_REQUEST_ACCOUNTS ||
        tx.code === ProviderErrorCode.USER_DENIED_REQUEST_SIGNATURE
      ) {
        getErrorMessage({
          code: tx.code,
          data: '',
          message: tx.message
        })
        setObjectErrorMessage({
          code: tx.code,
          data: '',
          message: tx.message
        })
        setPendingTx(false)
        setButtonState(ButtonHaloStates.Disabled)
        sethasError(true)
      } else {
        await tx.wait()
        setPendingTx(false)
        setButtonState(ButtonHaloStates.Disabled)
        setWithdrawValue('')
        sethasError(false)
      }
    } catch (e) {
      console.error(e)
      setPendingTx(false)
      setButtonState(ButtonHaloStates.Disabled)
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
    /** log deposit in GA
     */
    ReactGA.event({
      category: 'Vest',
      action: 'Withdraw',
      label: account ? 'User Address: ' + account : '',
      value: parseFloat(haloToClaim.toString())
    })
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
                    BALANCE: {xHaloHaloBalance} xRNBW
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
              {buttonState === ButtonHaloStates.Disabled && <>{t('claimHalo')}</>}
              {buttonState === ButtonHaloStates.Approved && (
                <>{t('claimXHalo', { amount: formatNumber(haloToClaim, NumberFormat.long) })}</>
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
              message={message}
              closeError={() => {
                sethasError(false)
              }}
            />
          }
        </BaseModal>
      )}
    </>
  )
}
