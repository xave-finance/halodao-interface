import React from 'react'
import Modal from 'components/Modal'
import styled from 'styled-components'
import { ExternalLink, TYPE } from 'theme'
import { formatNumber } from 'utils/formatNumber'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useVestingModalToggle } from 'state/application/hooks'
import { ReactComponent as CloseIcon } from '../../assets/images/x.svg'
import BunnyWithSweets from '../../assets/svg/bunny-with-sweets.svg'
import BunnyWithConfetti from '../../assets/svg/bunny-with-confetti.svg'
import { ButtonHaloWhite } from 'components/Button'
import { PoolVestingInfo } from 'state/user/actions'
import { NETWORK_SUPPORTED_FEATURES } from '../../constants/networks'
import { useActiveWeb3React } from '../../hooks'
import { ExternalLink as ExternalLinkIcon } from 'react-feather'
import { ChainId } from '@sushiswap/sdk'

const StyledWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  background-color: ${({ theme }) => theme.modalBGAlt}
  color: white;
  margin: 0;
  padding: 0;
  width: 100%;
  position: relative;
`

const StyledCloseIconWrapper = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const StyledContent = styled.div`
  padding: 2rem;
  text-align: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};

  .bal-rewards {
    margin-top: 8px;
    font-family: 'Fredoka One';
    font-size: 36px;
    font-weight: 400;
    line-height: 43.56px;
  }

  .bal-halo {
    font-size: 16px;
    font-weight: 700;
    line-height: 20.8px;
  }

  button {
    margin-top: 20px;
    margin-bottom: 10px;
  }

  a {
    font-weight: 600;
  }

  img {
    margin: 0 auto;
  }
`

const StyledExternalLink = styled(ExternalLink)`
  color: white;
`

interface VestingModalProps {
  poolVestingInfo?: PoolVestingInfo
}

interface AlternativeButtonProps {
  chainId: ChainId
}

const AlternativeButton = ({ chainId }: AlternativeButtonProps) => {
  return (
    <button
      className={`
   flex items-center justify-center
   font-bold text-white
   py-2 w-full
   rounded
   text-primary font-bold
   bg-white
   border-2 border-primary
 `}
      onClick={() => {
        if (chainId === ChainId.MATIC) {
          window.location.href =
            'https://app.sushi.com/swap?inputCurrency=0xc104e54803aba12f7a171a49ddc333da39f47193&outputCurrency=0x18e7bdb379928a651f093ef1bc328889b33a560c'
        }
      }}
    >
      Let&apos;s Vest! <span className="mr-2" /> <ExternalLinkIcon />
    </button>
  )
}

const VestingModal = ({ poolVestingInfo }: VestingModalProps) => {
  const isOpen = useModalOpen(ApplicationModal.VESTING)
  const toggleModal = useVestingModalToggle()
  const poolName = poolVestingInfo?.name ?? 'pool'
  const earningRewards = poolVestingInfo?.balance.rewardToken ?? 0
  const earningHALO = poolVestingInfo?.balance.halo ?? 0
  const { chainId } = useActiveWeb3React()
  const features = NETWORK_SUPPORTED_FEATURES[chainId as ChainId]

  return (
    <Modal isOpen={isOpen} onDismiss={toggleModal}>
      <StyledWrapper>
        <StyledCloseIconWrapper onClick={toggleModal}>
          <CloseIcon />
        </StyledCloseIconWrapper>
        <StyledContent>
          {features?.vest && (
            <div className="flex flex-col justify-center items-center w-full">
              <TYPE.body color="white">From your {poolName} you have earned</TYPE.body>
              <div className="bal-rewards">{formatNumber(earningRewards)} xRNBW</div>
              <div className="bal-halo">({formatNumber(earningHALO)} RNBW)</div>
              <img src={BunnyWithSweets} alt="Bunny Mascot" />
              <TYPE.body color="white">As xRNBW, you&apos;re earning right now!</TYPE.body>
              <ButtonHaloWhite padding="8px" onClick={toggleModal}>
                Let&apos;s Vest!
              </ButtonHaloWhite>
            </div>
          )}
          {!features?.vest && (
            <div className="flex flex-col justify-center items-center w-full">
              <img src={BunnyWithConfetti} alt="Bunny Mascot" />
              <span className="mb-2" />
              <TYPE.body color="white">{poolName} rewards Harvested</TYPE.body>
              <span className="mb-4" />
              <TYPE.body color="white">
                Your harvested <span className="font-bold">{formatNumber(earningRewards)} </span> xRNBW is already part
                of the Rainbow Pool earning vesting rewards!
              </TYPE.body>
              <span className="mb-2" />
              <AlternativeButton chainId={chainId as ChainId} />
            </div>
          )}
          <StyledExternalLink href="https://docs.halodao.com/products/dessert-pool/how-vesting-works">
            Learn more
          </StyledExternalLink>
        </StyledContent>
      </StyledWrapper>
    </Modal>
  )
}

export default VestingModal
