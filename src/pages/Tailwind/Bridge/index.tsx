import React from 'react'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import InfoCard from 'components/Tailwind/Cards/InfoCard'
import { NETWORK_ICON, NETWORK_LABEL } from '../../../constants/networks'

const Bridge = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-16 md:items-center">
        <div className="md:w-1/3">
          <PageHeaderLeft
            subtitle=""
            title="Bridge"
            caption="Move your ERC-20 token from EVM bridge to EVM bridge."
            link={{ text: 'Learn about bridge', url: 'https://docs.halodao.com' }}
          />
          <InfoCard
            title="Some Extra Info"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Parturient id vitae morbi ipsum est maecenas tellus at. Consequat in justo"
          />
        </div>
        <div className="md:w-3/4">
          <div className="flex items-start bg-white mt-8 py-6 px-8 shadow-md rounded-card md:h-64">
            <div>tracy</div>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-12"></div>
    </PageWrapper>
  )
}

export default Bridge
