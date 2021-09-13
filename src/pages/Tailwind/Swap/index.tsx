import React from 'react'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import SwapPanel from './SwapPanel'
import InfoCard from 'components/Tailwind/Cards/InfoCard'

const Swap = () => {
  return (
    <PageWrapper className="mb-8">
      <div className="md:float-left md:w-1/2">
        <PageHeaderLeft
          subtitle=""
          title="Swap"
          caption="Swap your ERC-20 tokens."
          link={{ text: 'Learn about swap', url: 'https://docs.halodao.com/get-started/how-to-swap' }}
        />
      </div>
      <div className="md:float-right md:w-1/2">
        <div className="flex items-start bg-white py-6 px-8 border border-primary-hover shadow-md rounded-card">
          <div className="w-full">
            <SwapPanel />
          </div>
        </div>
      </div>
      <div className="hidden md:flex items-start md:w-1/2">
        <InfoCard title="Swap Info" description="Swap between various stablecoins here at accurate prices" />
      </div>
    </PageWrapper>
  )
}

export default Swap
