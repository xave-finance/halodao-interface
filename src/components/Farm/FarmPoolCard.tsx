import React, { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { Card, Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import {
  ButtonHalo,
  ButtonHaloOutlined,
  ButtonOutlined,
  ButtonHaloStates,
  ButtonHaloSimpleStates,
  ButtonMax
} from '../Button'
import Column, { AutoColumn } from '../Column'
import Row, { RowFixed, RowBetween, RowFlat } from '../Row'
import { FixedHeightRow } from '../PositionCard'
import { CustomLightSpinner, ExternalLink, HideSmall, TYPE, ButtonText } from 'theme'
import NumericalInput from 'components/NumericalInput'
import { GreyCard } from '../Card'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { formatEther, parseEther } from 'ethers/lib/utils'
import Spinner from 'assets/images/spinner.svg'
import SpinnerPurple from 'assets/images/spinner-purple.svg'
import BunnyMoon from 'assets/svg/bunny-with-moon.svg'
import BunnyRewards from 'assets/svg/bunny-rewards.svg'
import ArrowRight from 'assets/svg/arrow-right.svg'
import LinkIcon from 'assets/svg/link-icon.svg'
import { HALO_REWARDS_MESSAGE, ZERO_ADDRESS } from '../../constants/index'
import { useActiveWeb3React } from 'hooks'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { PoolInfo, PoolProvider } from 'halo-hooks/usePoolInfo'
import { TokenPrice, useTokenPrice } from 'halo-hooks/useTokenPrice'
import { getPoolLiquidity } from 'utils/poolInfo'
import { useTotalSupply } from 'data/TotalSupply'
import { formatNumber, NumberFormat, toFixed } from 'utils/formatNumber'
import { monthlyReward, apy, getRewarderAPR } from 'utils/poolAPY'
import { ApprovalState } from '../../hooks/useApproveCallback'
import { JSBI, TokenAmount } from '@halodao/sdk'
import {
  useDepositWithdrawHarvestCallback,
  useStakedBPTPerPool,
  useUnclaimedRewardsPerPool,
  useRewardTokenPerSecond,
  useTotalAllocPoint,
  useUnclaimedRewarderRewardsPerPool,
  useRewarderUSDPrice
} from 'halo-hooks/useRewards'
import useTokenBalance from 'sushi-hooks/queries/useTokenBalance'
import { ErrorText } from 'components/Alerts'
import { updatePoolToHarvest } from 'state/user/actions'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { tokenSymbolForPool } from 'utils/poolInfo'
import { PENDING_REWARD_FAILED } from 'constants/pools'
import { AmmRewardsVersion, getAmmRewardsContractAddress } from 'utils/ammRewards'
import { useHALORewardsContract, useTokenContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { consoleLog } from 'utils/simpleLogger'
import { MetamaskError } from 'constants/errors'
import { BigNumber } from '@ethersproject/bignumber'
import { addPendingRewards, didAlreadyMigrate } from 'utils/firebaseHelper'
import { AlertCircle, Check, GitPullRequest } from 'react-feather'
import useTokenAllowance from 'halo-hooks/tokens/useTokenAllowance'
import { MouseoverTooltip } from '../Tooltip'

const StyledFixedHeightRowCustom = styled(FixedHeightRow)`
  padding: 1.5rem;
  margin: 0 -1rem;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 10px;
  width: auto;
  transition: border 100ms ease-in;

  &.inactive:hover {
    border-color: ${({ theme }) => theme.primary1};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
    padding: 0 30px 20px;
    cursor: default;

    &.inactive:hover {
      border-color: transparent;
    }
  `};
`

const StyledCard = styled(GreyCard)<{ bgColor: any }>`
  border: none;
  background: ${({ theme }) => transparentize(0.6, theme.bg1)};
  position: relative;
  overflow: visible;
  padding: 5px 0 5px 0;
  border-radius: 0px;

  ${({ theme }) => theme.mediaWidth.upToSmall`  
    background: #ffffff;
    padding: 5px 0 0 0;
    border-radius: 4px;
    box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;
    border-radius: 5px;
    border: 1px solid #15006d;

    &.expanded {
      border-bottom: none;
    }
  `};
`

const StyledRowFixed = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    flex-direction: column;
    margin-top: 0.5rem;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;

    &:first-of-type {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 1rem;
      margin-bottom: 0.5rem;
      line-height: 16px;
      letter-spacing: 0.2rem;
    }
    &:last-of-type {
      width: 100%;
      margin-bottom: 0.5rem;
    }
  `};
`

const StyledTextForValue = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    line-height: 130%;
  `};
  font-size: 16px;
`

const LabelText = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  margin-top: 12px !important;
  text-transform: uppercase;
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`  
    display: block;
  `};
  &.first {
    margin-top: 0 !important;
  }
`

const ManageCloseButton = styled(ButtonOutlined)`
  width: 100%;
  padding: 4px 8px;
  border-radius: 5px;
  font-weight: 700;
  font-size: 16px;

  :hover {
    background: ${({ theme }) => theme.text4};
    color: white;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    background: ${({ theme }) => theme.text4};
    color: white;
    width: 100%;
    border-radius: 4px;
    padding: 6px 12px;
    font-weight: 900;
  `};
`

const ManageCloseButtonAlt = styled(ButtonText)`
  padding: 4px 8px;
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.primary1};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    background: ${({ theme }) => theme.text4};
    color: white;
    width: 100%;
    border-radius: 4px;
    padding: 6px 12px;
    font-weight: 900;
  `};
`

const LineSeparator = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
    border-bottom: 1px solid #471BB2;
    margin: 10px 30px 0;
  `};
`

export const StyledFixedHeightRowWeb = styled(RowBetween)`
  height: 24px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 0;
  `};
`

export const StyledCardBoxWeb = styled(RowBetween)`
  display: inline;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const StyledButtonWidth = styled(ButtonOutlined)`
  margin: 0;
  minwidth: 0;
  display: flex;
  padding: 0
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    border: 0;
  `};
`

const ExpandedCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #ffffff;
  border-radius: 5px;
  border: 1px solid #15006d;
  margin-top: 12px;
  box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1);

  ${({ theme }) => theme.mediaWidth.upToSmall`
    border: none;
    margin-top: 0;
  `}
`

const GetBPTButton = styled(ExternalLink)`
  color: #518cff;
  text-decoration-line: underline;
  line-height: 130%;
  font-weight: 600;
  margin-bottom: 4px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    border: 1px solid #518CFF;
    box-sizing: border-box;
    border-radius: 20px;
    padding: 0.5rem;
    width: 100%;
    margin-bottom: 0.5rem;
    text-align: center;
    text-decoration: none;
  `};

  & img {
    display: inline;
    vertical-align: baseline;
    margin-left: 6px;
    height: 14px;
    margin-bottom: -2px;
  }
`

const StakeUnstakeContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px 30px 0 30px;
  justify-content: space-between;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
`

const StakeUnstakeChild = styled.div`
  width: 48%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    margin-bottom: 20px;
  `};

  #stake-button,
  #unstake-button {
    margin-top: 6px;
  }
`

const HideSmallFullWidth = styled(HideSmall)`
  width: 100%;
`

const BannerContainer = styled(RowFlat)`
  padding: 20px 30px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding-top: 0;
  `};
`

const Banner = styled(Card)`
  background: rgba(255, 128, 128, 0.2);
  border-radius: 10px;
  border: 0;
  color: #000000;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & div {
    font-weight: 500;
    width: 80%;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 100%;
    `};
  }

  & img {
    width: 40px;
  }

  a {
    font-weight: 600;
    color: #518cff;
  }
`

const RewardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px 30px;
  justify-content: space-around;
  background: #15006d;
  color: white;
  align-items: center;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-start;
  `};
`
const RewardsChildFlex = styled.div`
  display: flex;
  flex-direction: column;
`
const RewardsChildFlexContainer = styled(RewardsChildFlex)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 8em;
`
const RewardsChild = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};

  &.main {
    flex: 1;
    padding-left: 30px;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      padding: 15px 0;
    `};
  }

  &.close {
    display: none;
    text-align: right;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      display: block;
    `};

    & button {
      color: white;
      font-weight: 900;
      text-decoration: underline;
      margin-top: 10px;
    }
  }

  img {
    width: 35px;
  }

  & .label {
    font-weight: bold;
  }

  & .balance {
    font-family: 'Fredoka One';
    font-size: 36px;
  }

  & .rewarder {
    font-family: 'Fredoka One';
    font-size: 28px;
    padding-bottom: 5px;
  }

  a {
    text-decoration: none;
  }
`

const ClaimButton = styled(ButtonOutlined)`
  background: white;
  color: ${({ theme }) => theme.text1};
  border-radius: 10px;
  font-weight: bold;
  width: 234px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};

  &:focus {
    box-shadow: 0 0 0 1px #2700ce;
  }
  &:hover {
    box-shadow: 0 0 0 1px #2700ce;
  }
  &:active {
    box-shadow: 0 0 0 1px #2700ce;
  }

  img {
    width: 17px;
  }
`

interface FarmPoolCardProps {
  poolInfo: PoolInfo
  tokenPrice: TokenPrice
  isActivePool: boolean
  rewardsVersion?: AmmRewardsVersion
  preselected?: boolean
}

export default function FarmPoolCard({
  poolInfo,
  tokenPrice,
  isActivePool,
  rewardsVersion = AmmRewardsVersion.Latest,
  preselected = false
}: FarmPoolCardProps) {
  const { chainId, account } = useActiveWeb3React()
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const history = useHistory()

  const [showMore, setShowMore] = useState(preselected)
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [stakeButtonState, setStakeButtonState] = useState(ButtonHaloStates.Disabled)
  const [unstakeButtonState, setUnstakeButtonState] = useState(ButtonHaloSimpleStates.Disabled)
  const [harvestButtonState, setHarvestButtonState] = useState(ButtonHaloSimpleStates.Disabled)
  const [isTxInProgress, setIsTxInProgress] = useState(false)
  const [alreadyMigrated, setAlreadyMigrated] = useState(false)

  // Get user BPT balance
  const bptBalanceAmount = useTokenBalance(poolInfo.address)
  const bptBalance = parseFloat(formatEther(bptBalanceAmount.value.toString()))

  // Get user staked BPT
  const stakedBPTs = useStakedBPTPerPool([poolInfo.pid], rewardsVersion)
  const bptStaked = stakedBPTs[poolInfo.pid] ?? 0

  // Pool liquidity
  const poolLiquidity = getPoolLiquidity(poolInfo, tokenPrice)

  // Staked BPT value calculation
  const totalSupplyAmount = useTotalSupply(poolInfo.asToken)
  const totalSupply = totalSupplyAmount ? parseFloat(formatEther(`${totalSupplyAmount.raw}`)) : 0
  const lpTokenPrice = totalSupply > 0 && poolLiquidity > 0 ? poolLiquidity / totalSupply : 0
  const bptStakedValue = bptStaked * lpTokenPrice

  // Get user earned HALO
  const unclaimedRewards = useUnclaimedRewardsPerPool([poolInfo.pid], rewardsVersion)
  let unclaimedPoolRewards = unclaimedRewards[poolInfo.pid] ?? 0
  const hasPendingRewardTokenError = unclaimedPoolRewards === PENDING_REWARD_FAILED
  unclaimedPoolRewards = hasPendingRewardTokenError ? 0 : unclaimedPoolRewards
  const unclaimedHALO = unclaimedPoolRewards

  // Get user earned rewarder
  const rewarderToken = useUnclaimedRewarderRewardsPerPool([poolInfo.pid], poolInfo.rewarderAddress)

  // Make use of `useTokenAllowance` for checking & setting allowance
  const rewardsContractAddress = getAmmRewardsContractAddress(chainId, rewardsVersion)
  // Change this when migrating to a new AMM Rewards Version
  const rewardsContractV1_1_ContractAddress = getAmmRewardsContractAddress(chainId, AmmRewardsVersion.Latest) // eslint-disable-line

  const tokenAmount = new TokenAmount(poolInfo.asToken, JSBI.BigInt(parseEther(`${parseFloat(stakeAmount) || 0}`)))
  const [approveState, approveCallback] = useTokenAllowance(tokenAmount, rewardsContractAddress)
  const lpTokenContract = useTokenContract(poolInfo.address)

  // Make use of `useDepositWithdrawPoolTokensCallback` for deposit & withdraw poolTokens methods
  const { deposit, withdraw, harvest } = useDepositWithdrawHarvestCallback(rewardsVersion)
  // Change this when migrating to a new AMM Rewards Version
  const rewardsContractV1_1 = useHALORewardsContract(AmmRewardsVersion.Latest) // eslint-disable-line

  const addTransaction = useTransactionAdder()

  /**
   * APY computation Rewards
   */
  const rewardTokenPerSecond = useRewardTokenPerSecond(rewardsVersion)
  const expectedMonthlyReward = monthlyReward(rewardTokenPerSecond)

  const totalAllocPoint = useTotalAllocPoint(rewardsVersion)
  const allocPoint = poolInfo.allocPoint

  // stakedLiquidity = LPToken.balanceOf(AmmRewards) * lpTokenUSDValue
  const totalStakedAmount = useTokenBalance(poolInfo.address, rewardsContractAddress)
  const totalStaked = parseFloat(formatEther(totalStakedAmount.value.toString()))
  const stakedLiquidity = totalStaked * lpTokenPrice

  const rawAPY = apy(expectedMonthlyReward, totalAllocPoint, tokenPrice, allocPoint, stakedLiquidity)
  const poolAPY = rawAPY === 0 ? t('new') : `${formatNumber(rawAPY, NumberFormat.long)}%`

  /**
   * APR computation Rewarder
   */
  const rewarderTokenUsdPrice = useRewarderUSDPrice(poolInfo.rewarderAddress)
  const rewarderAPR =
    rewarderToken &&
    getRewarderAPR(
      rewardTokenPerSecond,
      rewarderToken.multiplier,
      allocPoint,
      totalAllocPoint,
      rewarderTokenUsdPrice,
      stakedLiquidity
    )

  const [accumulativeTotal, setAccumulativeTotal] = useState('')

  useEffect(() => {
    const total = rawAPY === 0 ? t('new') : rawAPY + (!rewarderAPR || rewarderAPR === Infinity ? 0 : rewarderAPR)
    setAccumulativeTotal(total === t('new') ? total : `${formatNumber(total, NumberFormat.long)}%`)
  }, [rewarderAPR, rawAPY, t])

  const poolHasRewarder = poolInfo.rewarderAddress !== undefined && poolInfo.rewarderAddress !== ZERO_ADDRESS
  const hasAprBreakdown =
    rawAPY !== 0 &&
    !!rewarderAPR &&
    rewarderAPR !== Infinity &&
    !alreadyMigrated &&
    (unclaimedHALO > 0 || bptStaked > 0)

  let stakingMessage = HALO_REWARDS_MESSAGE.staking
  let unstakingMessage = HALO_REWARDS_MESSAGE.unstaking

  switch (poolInfo.provider) {
    case PoolProvider.Halo:
      stakingMessage = HALO_REWARDS_MESSAGE.stakingHLP
      unstakingMessage = HALO_REWARDS_MESSAGE.unstakingHLP
      break
    case PoolProvider.Uni:
      stakingMessage = HALO_REWARDS_MESSAGE.stakingUNI
      unstakingMessage = HALO_REWARDS_MESSAGE.unstakingUNI
      break
    default:
      break
  }

  // Wether to show migrate or harvest button
  const showMigrateButton = (() => {
    return rewardsVersion === AmmRewardsVersion.V1
  })()

  /**
   * Updating the state of stake button
   */
  useEffect(() => {
    if (isTxInProgress) return

    const amountAsFloat = parseFloat(stakeAmount)
    if (amountAsFloat > 0 && amountAsFloat <= bptBalance) {
      if (approveState === ApprovalState.APPROVED) {
        setStakeButtonState(ButtonHaloStates.Approved)
      } else if (approveState === ApprovalState.PENDING) {
        setStakeButtonState(ButtonHaloStates.Approving)
      } else {
        setStakeButtonState(ButtonHaloStates.NotApproved)
      }
    } else {
      setStakeButtonState(ButtonHaloStates.Disabled)
    }
  }, [approveState, stakeAmount, bptBalance, isTxInProgress])

  /**
   * Updating the state of unstake button
   */
  useEffect(() => {
    if (isTxInProgress) return

    const amountAsFloat = parseFloat(unstakeAmount)
    if (amountAsFloat > 0 && amountAsFloat <= bptStaked) {
      setUnstakeButtonState(ButtonHaloSimpleStates.Enabled)
    } else {
      setUnstakeButtonState(ButtonHaloSimpleStates.Disabled)
    }
  }, [unstakeAmount, bptStaked, isTxInProgress])

  /**
   * Updating the state of harvest/migrate button
   */
  useEffect(() => {
    if (isTxInProgress) return

    if (showMigrateButton) {
      if (!alreadyMigrated && (unclaimedHALO > 0 || bptStaked > 0)) {
        setHarvestButtonState(ButtonHaloSimpleStates.Enabled)
      } else {
        setHarvestButtonState(ButtonHaloSimpleStates.Disabled)
      }
      return
    }

    if (unclaimedHALO > 0) {
      setHarvestButtonState(ButtonHaloSimpleStates.Enabled)
    } else {
      setHarvestButtonState(ButtonHaloSimpleStates.Disabled)
    }
  }, [unclaimedHALO, isTxInProgress, bptStaked, showMigrateButton, alreadyMigrated])

  /**
   * Checks if user already migrated (from v1.0 to v1.1 AMMRewards)
   */
  useEffect(() => {
    didAlreadyMigrate(account ?? '', poolInfo.address).then(migrated => {
      setAlreadyMigrated(migrated)
    })
  }, [account, poolInfo.address, rewardsVersion])

  /**
   * Approves the stake amount
   */
  const approveStakeAmount = async () => {
    setIsTxInProgress(true)
    setStakeButtonState(ButtonHaloStates.Approving)

    await approveCallback()

    setIsTxInProgress(false)
  }

  /**
   * Stakes the LP token to Rewards contract
   */
  const stakeLpToken = async () => {
    setIsTxInProgress(true)
    setStakeButtonState(ButtonHaloStates.TxInProgress)

    try {
      const tx = await deposit(poolInfo.pid, parseEther(stakeAmount) ?? 0, poolInfo.address)
      await tx.wait()
    } catch (e) {
      console.error('Stake error: ', poolInfo.address, e)
    }

    setStakeAmount('')
    setStakeButtonState(ButtonHaloStates.Disabled)
    setIsTxInProgress(false)
    /** log stake in GA
     */
    ReactGA.event({
      category: 'Farm',
      action: 'Stake LP token',
      label: poolInfo.pair,
      value: parseFloat(formatEther(parseEther(stakeAmount).toString()))
    })
  }

  /**
   * Unstake LP token from Rewards contract
   */
  const unstakeLpToken = async () => {
    setIsTxInProgress(true)
    setUnstakeButtonState(ButtonHaloSimpleStates.TxInProgress)

    try {
      const tx = await withdraw(poolInfo.pid, parseEther(unstakeAmount) ?? 0, poolInfo.address)
      await tx.wait()
    } catch (e) {
      console.error('Unstake error: ', e)
    }

    setUnstakeAmount('')
    setUnstakeButtonState(ButtonHaloSimpleStates.Disabled)
    setIsTxInProgress(false)
    /** log unstake in GA
     */
    ReactGA.event({
      category: 'Farm',
      action: 'Unstake LP token',
      label: poolInfo.pair,
      value: parseFloat(formatEther(parseEther(unstakeAmount).toString()))
    })
  }

  /**
   * Handles the user clicking "Harvest" button
   */
  const handleClaim = async () => {
    setIsTxInProgress(true)
    setHarvestButtonState(ButtonHaloSimpleStates.TxInProgress)

    // Claim/withdraw rewards
    try {
      const tx = await harvest(poolInfo.pid)
      await tx.wait()
      setHarvestButtonState(ButtonHaloSimpleStates.Disabled)
    } catch (e) {
      console.error('Claim error: ', e)
      setHarvestButtonState(ButtonHaloSimpleStates.Enabled)
      return
    }

    /** log harvest in GA
     */
    ReactGA.event({
      category: 'Farm',
      action: 'Harvest',
      label: poolInfo.pair,
      value: unclaimedPoolRewards
    })

    // Redirect to vesting page
    const vestingInfo = {
      name: poolInfo.pair,
      balance: {
        rewardToken: unclaimedPoolRewards,
        halo: unclaimedHALO
      }
    }

    // Updates `AppState.user.poolToHarvest` so Vesting page can display the Harvest modal
    dispatch(updatePoolToHarvest({ vestingInfo }))

    history.push('/vesting')
  }

  /**
   * Handles the user clicking "Migrate" button
   */
  const handleMigrate = async () => {
    setIsTxInProgress(true)
    setHarvestButtonState(ButtonHaloSimpleStates.TxInProgress)

    const valueToMigrate = parseEther(toFixed(bptStaked, 8))
    let txHashes: string[] = []
    let totalGas = BigNumber.from(0)

    try {
      const tx1 = await withdraw(poolInfo.pid, valueToMigrate ?? 0, poolInfo.address)
      const txnResult1 = await tx1.wait()

      const tx2 = await lpTokenContract?.approve(rewardsContractV1_1_ContractAddress, valueToMigrate) // eslint-disable-line
      const txnResult2 = await tx2.wait()

      addTransaction(tx2, {
        summary: `Approved ${poolInfo.asToken.symbol} to be migrated to v1.1`
      })

      const tx3 = await rewardsContractV1_1?.deposit(poolInfo.pid, valueToMigrate, account)
      const txnResult3 = await tx3.wait()

      addTransaction(tx3, {
        summary: `${poolInfo.asToken.symbol} migrated to v1.1`
      })

      txHashes = [tx1.hash, tx2.hash, tx3.hash]
      totalGas = txnResult1.gasUsed.add(txnResult2.gasUsed).add(txnResult3.gasUsed)

      consoleLog(
        `Storing pending reward token: ${unclaimedHALO}, total gas costs: ${formatEther(totalGas)}, hashes: ${txHashes}`
      )

      addPendingRewards(
        account ?? '',
        poolInfo.address,
        poolInfo.pid,
        `${unclaimedHALO}`,
        totalGas.toString(),
        txHashes
      )

      setIsTxInProgress(false)
      setAlreadyMigrated(true)
    } catch (e) {
      console.error('Migration error: ', e)

      // when txn signature is canceled
      if ((e as any).code === MetamaskError.Cancelled) {
        setIsTxInProgress(false)
      }

      return
    }

    /** log harvest in GA
     */
    ReactGA.event({
      category: 'Farm',
      action: 'Migrate',
      label: poolInfo.pair,
      value: unclaimedPoolRewards
    })
  }

  return (
    <StyledCard
      id={`pool-${poolInfo.address.toLowerCase()}`}
      bgColor="#ffffff"
      className={'pool-card ' + (showMore ? 'expanded' : 'default')}
    >
      <AutoColumn>
        {/* Pool Row default */}
        <StyledFixedHeightRowCustom
          className={showMore ? 'active' : 'inactive'}
          onClick={() => {
            if (!showMore) {
              setShowMore(true)
            }
          }}
        >
          <StyledRowFixed width="18%">
            <DoubleCurrencyLogo
              currency0={poolInfo.tokens[0].asToken}
              currency1={poolInfo.tokens[1].asToken}
              size={16}
            />
            &nbsp;
            <StyledTextForValue fontWeight={600}>{poolInfo.pair}</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="16%">
            <LabelText className="first">{t('apr')}:</LabelText>
            <StyledTextForValue>{isActivePool ? accumulativeTotal : t('inactive')}</StyledTextForValue> &nbsp;
            {hasAprBreakdown && (
              <MouseoverTooltip
                text={
                  <div>
                    <div>{t('apr-breakdown')}</div>
                    <ul style={{ marginLeft: '30px', listStyle: 'unset' }}>
                      <li>{poolAPY} xRNBW</li>
                      <li>
                        {!rewarderAPR || rewarderAPR === Infinity
                          ? t('new')
                          : `${formatNumber(rewarderAPR, NumberFormat.long)}% `}
                        {rewarderToken?.tokenName}
                      </li>
                    </ul>
                  </div>
                }
                placement={'top'}
              >
                <AlertCircle size={'16'} />
              </MouseoverTooltip>
            )}
          </StyledRowFixed>
          <StyledRowFixed width="18%">
            <LabelText className="first">{t('totalPoolValue')}:</LabelText>
            <StyledTextForValue>{formatNumber(poolLiquidity, NumberFormat.usd)}</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="13%">
            <LabelText>{t('stakeable')}:</LabelText>
            <StyledTextForValue>
              {formatNumber(bptBalance)} {tokenSymbolForPool(poolInfo.address, chainId)}
            </StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="16%">
            <LabelText>{t('valueStaked')}</LabelText>
            <StyledTextForValue>{formatNumber(bptStakedValue, NumberFormat.usd)}</StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="16%">
            <LabelText>{t('earned')}:</LabelText>
            <StyledTextForValue>
              {hasPendingRewardTokenError ? (
                <u>{formatNumber(unclaimedHALO, isActivePool ? undefined : NumberFormat.short)} xRNBW</u>
              ) : rewardsVersion === AmmRewardsVersion.V1 && alreadyMigrated ? (
                <>0 xRNBW</>
              ) : (
                <div>{formatNumber(unclaimedHALO, isActivePool ? undefined : NumberFormat.short)} xRNBW</div>
              )}
              {poolHasRewarder && rewarderToken && (
                <div style={{ marginLeft: '-13px' }}>
                  {' + '}
                  {rewarderToken && formatNumber(rewarderToken.amount, isActivePool ? undefined : NumberFormat.short)}
                  &nbsp;
                  {rewarderToken?.tokenName}
                </div>
              )}
            </StyledTextForValue>
          </StyledRowFixed>
          <StyledRowFixed width="8%" justify="flex-end">
            {account && (
              <>
                {showMore ? (
                  <HideSmallFullWidth>
                    <ManageCloseButton onClick={() => setShowMore(!showMore)}>{t('closeTxt')}</ManageCloseButton>
                  </HideSmallFullWidth>
                ) : (
                  <ManageCloseButtonAlt onClick={() => setShowMore(!showMore)}>
                    {isActivePool ? t('add') : t('manage')}
                  </ManageCloseButtonAlt>
                )}
              </>
            )}
          </StyledRowFixed>
        </StyledFixedHeightRowCustom>

        {/* Pool Row expanded */}
        {showMore && (
          <ExpandedCard>
            <LineSeparator />

            <StakeUnstakeContainer>
              <StakeUnstakeChild>
                <FixedHeightRow>
                  <TYPE.label>
                    BALANCE: {formatNumber(bptBalance)} {tokenSymbolForPool(poolInfo.address, chainId)}
                  </TYPE.label>
                </FixedHeightRow>
                <RowFlat>
                  <GetBPTButton href={poolInfo.addLiquidityUrl}>
                    {t('getTokens').replace('%s', tokenSymbolForPool(poolInfo.address, chainId))}
                    <img src={LinkIcon} alt="Link Icon" />
                  </GetBPTButton>
                </RowFlat>
                <RowFlat>
                  <NumericalInput
                    style={{
                      width: '100%'
                    }}
                    value={stakeAmount}
                    onUserInput={amount => setStakeAmount(amount)}
                    id="stake-input"
                    disabled={!isActivePool}
                  />
                  <ButtonMax
                    onClick={() => {
                      setStakeAmount(`${toFixed(bptBalance, 8)}`)
                    }}
                    disabled={!isActivePool}
                  >
                    {t('max')}
                  </ButtonMax>
                </RowFlat>
                <Column>
                  <ButtonHalo
                    id="stake-button"
                    disabled={
                      [ButtonHaloStates.Disabled, ButtonHaloStates.Approving, ButtonHaloStates.TxInProgress].includes(
                        stakeButtonState
                      ) || !isActivePool
                    }
                    onClick={() => {
                      if (stakeButtonState === ButtonHaloStates.Approved) {
                        stakeLpToken()
                      } else {
                        approveStakeAmount()
                      }
                    }}
                  >
                    {!isActivePool ? (
                      <>{t('staking disabled')}</>
                    ) : (
                      <>
                        {(stakeButtonState === ButtonHaloStates.Disabled ||
                          stakeButtonState === ButtonHaloStates.Approved) && <>{t('stake')}</>}
                        {stakeButtonState === ButtonHaloStates.NotApproved && <>{t('approve')}</>}
                        {stakeButtonState === ButtonHaloStates.Approving && (
                          <>
                            {HALO_REWARDS_MESSAGE.approving}&nbsp;
                            <CustomLightSpinner src={Spinner} alt="loader" size={'15px'} />{' '}
                          </>
                        )}
                        {stakeButtonState === ButtonHaloStates.TxInProgress && (
                          <>
                            {stakingMessage}&nbsp;
                            <CustomLightSpinner src={Spinner} alt="loader" size={'15px'} />{' '}
                          </>
                        )}
                      </>
                    )}
                  </ButtonHalo>
                  {parseFloat(stakeAmount) > 0 && parseFloat(stakeAmount) > bptBalance && (
                    <ErrorText>{t('insufficientFunds')}</ErrorText>
                  )}
                </Column>
              </StakeUnstakeChild>
              <StakeUnstakeChild>
                <FixedHeightRow>
                  <TYPE.label>
                    STAKED: {formatNumber(bptStaked)} {tokenSymbolForPool(poolInfo.address, chainId)}
                  </TYPE.label>
                </FixedHeightRow>
                <HideSmallFullWidth>
                  <Row height={23}>&nbsp;</Row>
                </HideSmallFullWidth>
                <RowFlat>
                  <NumericalInput
                    style={{
                      width: '100%'
                    }}
                    value={unstakeAmount}
                    onUserInput={amount => setUnstakeAmount(amount)}
                    id="unstake-input"
                  />
                  <ButtonMax
                    onClick={() => {
                      setUnstakeAmount(`${toFixed(bptStaked, 8)}`)
                    }}
                  >
                    {t('max')}
                  </ButtonMax>
                </RowFlat>
                <Column>
                  <ButtonHaloOutlined
                    id="unstake-button"
                    disabled={[ButtonHaloSimpleStates.Disabled, ButtonHaloSimpleStates.TxInProgress].includes(
                      unstakeButtonState
                    )}
                    onClick={unstakeLpToken}
                  >
                    {(unstakeButtonState === ButtonHaloSimpleStates.Disabled ||
                      unstakeButtonState === ButtonHaloSimpleStates.Enabled) && <>{t('unstake')}</>}
                    {unstakeButtonState === ButtonHaloSimpleStates.TxInProgress && (
                      <>
                        {unstakingMessage}&nbsp;
                        <CustomLightSpinner src={SpinnerPurple} alt="loader" size={'15px'} />{' '}
                      </>
                    )}
                  </ButtonHaloOutlined>
                  {parseFloat(unstakeAmount) > 0 && parseFloat(unstakeAmount) > bptStaked && (
                    <ErrorText>{t('insufficientFunds')}</ErrorText>
                  )}
                </Column>
              </StakeUnstakeChild>
            </StakeUnstakeContainer>

            <BannerContainer>
              <Banner>
                <Text>
                  {t('tokenCardRewardDescription')} Learn{' '}
                  <a
                    href="https://docs.halodao.com/products/rainbow-pool/how-vesting-works"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    more
                  </a>{' '}
                  about Vesting.
                </Text>
                <HideSmall>
                  <img src={BunnyMoon} alt="Bunny Moon" />
                </HideSmall>
              </Banner>
            </BannerContainer>

            <RewardsContainer>
              <RewardsChild>
                <img src={BunnyRewards} alt="Bunny Rewards" />
              </RewardsChild>
              <RewardsChild className="">
                <RewardsChildFlexContainer>
                  <RewardsChildFlex>
                    <Text className="label">{poolInfo.pair} Rewards:</Text>
                    <Text className="balance">
                      {showMigrateButton && alreadyMigrated ? (
                        <>0 xRNBW </>
                      ) : (
                        <>{formatNumber(unclaimedHALO, isActivePool ? undefined : NumberFormat.short)} xRNBW</>
                      )}
                    </Text>
                  </RewardsChildFlex>
                  {poolHasRewarder && (
                    <Text className="rewarder">
                      {' + '}
                      {rewarderToken &&
                        formatNumber(rewarderToken.amount, isActivePool ? undefined : NumberFormat.short)}
                      &nbsp;
                      {rewarderToken?.tokenName}
                    </Text>
                  )}
                </RewardsChildFlexContainer>
              </RewardsChild>
              <RewardsChild>
                <ClaimButton
                  onClick={showMigrateButton ? handleMigrate : handleClaim}
                  disabled={[ButtonHaloSimpleStates.Disabled, ButtonHaloSimpleStates.TxInProgress].includes(
                    harvestButtonState
                  )}
                >
                  {t(showMigrateButton ? (alreadyMigrated ? 'migrated' : 'migrate') : 'harvest')}
                  &nbsp;&nbsp;
                  {harvestButtonState === ButtonHaloSimpleStates.TxInProgress ? (
                    <CustomLightSpinner src={SpinnerPurple} alt="loader" size={'15px'} />
                  ) : showMigrateButton && alreadyMigrated ? (
                    <Check size={16} />
                  ) : showMigrateButton && !alreadyMigrated ? (
                    <GitPullRequest size={16} />
                  ) : (
                    <img src={ArrowRight} alt="Harvest icon" />
                  )}
                </ClaimButton>
              </RewardsChild>
              <RewardsChild className="close">
                <ButtonText onClick={() => setShowMore(!showMore)}>Close X</ButtonText>
              </RewardsChild>
            </RewardsContainer>
          </ExpandedCard>
        )}
      </AutoColumn>
    </StyledCard>
  )
}
