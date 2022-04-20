import { ChainId } from '@halodao/sdk'
import { NETWORK_LABEL } from 'constants/networks'
import { useActiveWeb3React } from 'hooks'
import React from 'react'
import PageWarning from '../Layout/PageWarning'

interface FeatureNotSupportedProps {
  isIsolated: boolean
}

const FeatureNotSupported = ({ isIsolated }: FeatureNotSupportedProps) => {
  const { chainId, account } = useActiveWeb3React()

  const caption = account
    ? `Ooops! Sorry this feature is not supported in ${NETWORK_LABEL[chainId as ChainId]}.`
    : 'Ooops! Sorry this feature is not supported.'

  return (
    <div
      id="unsupported_vesting_component"
      className={`
        flex items-center
        ${isIsolated ? 'py-6 px-8 border border-primary-hover shadow-md rounded-card bg-white' : ''}
      `}
    >
      <div className="w-full">
        <PageWarning caption={caption} />
      </div>
    </div>
  )
}

export default FeatureNotSupported
