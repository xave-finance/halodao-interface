import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import SwapPanel from './SwapPanel'
import InfoCard from 'components/Tailwind/Cards/InfoCard'

const Swap = () => {
  const { account, error } = useWeb3React()
  const [txDeadline, setTxDeadline] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  return (
    <PageWrapper className="mb-8">
      <div className="md:float-left md:w-1/2">
        <PageHeaderLeft
          subtitle=""
          title="Swap"
          caption="Swap your ERC-20 tokens."
          link={{ text: 'Learn about swap', url: 'https://docs.halodao.com' }}
        />
      </div>
      <div className="md:float-right md:w-1/2">
        <div className="flex items-start bg-white py-6 px-8 border border-primary-hover shadow-md rounded-card">
          <div className="w-full">
            <SwapPanel />
          </div>
        </div>
      </div>
      <div className="flex items-start md:w-1/2">
        <InfoCard
          title="Some Extra Info"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Parturient id vitae morbi ipsum est maecenas tellus at. Consequat in justo"
        />
      </div>
    </PageWrapper>
  )
}

export default Swap
