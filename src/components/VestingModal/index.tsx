import React from 'react'
import Modal from 'components/Modal'
import styled from 'styled-components'
import { ExternalLink, TYPE } from 'theme'
import { formatNumber } from 'utils/formatNumber'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useVestingModalToggle } from 'state/application/hooks'
import { ReactComponent as CloseIcon } from '../../assets/images/x.svg'
import BunnyWithSweets from '../../assets/svg/bunny-with-sweets.svg'
import { ButtonHaloWhite } from 'components/Button'
import { PoolVestingInfo } from 'state/user/actions'

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
    margin-bottom: 27px;
  }

  img {
    margin-bottom: 15px;
  }

  button {
    margin-top: 20px;
    margin-bottom: 10px;
  }

  a {
    font-weight: 600;
  }
`

const StyledExternalLink = styled(ExternalLink)`
  color: white;
`

interface VestingModalProps {
  poolVestingInfo?: PoolVestingInfo
}

const VestingModal = ({ poolVestingInfo }: VestingModalProps) => {
  const isOpen = useModalOpen(ApplicationModal.VESTING)
  const toggleModal = useVestingModalToggle()
  const poolName = poolVestingInfo?.name ?? 'pool'
  const earningRewards = poolVestingInfo?.balance.rewardToken ?? 0
  const earningHALO = poolVestingInfo?.balance.halo ?? 0

  return (
    <Modal isOpen={isOpen} onDismiss={toggleModal}>
      <StyledWrapper>
        <StyledCloseIconWrapper onClick={toggleModal}>
          <CloseIcon />
        </StyledCloseIconWrapper>
        <StyledContent>
          <TYPE.body color="white">From your {poolName} you have earned</TYPE.body>
          <div className="bal-rewards">{formatNumber(earningRewards)} RNBW</div>
          <div className="bal-halo">({formatNumber(earningHALO)} HALO)</div>
          <img src={BunnyWithSweets} alt="Bunny Mascot" />
          <TYPE.body color="white">As RNBW, you&apos;re earning right now!</TYPE.body>
          <ButtonHaloWhite padding="8px" onClick={toggleModal}>
            Let&apos;s Vest!
          </ButtonHaloWhite>
          <StyledExternalLink href="https://docs.halodao.com/products/dessert-pool/how-vesting-works">
            Learn more
          </StyledExternalLink>
        </StyledContent>
      </StyledWrapper>
    </Modal>
  )
}

export default VestingModal
