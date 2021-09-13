import React from 'react'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import InfoCard from 'components/Tailwind/Cards/InfoCard'
import PageWarning from 'components/Tailwind/Layout/PageWarning'

const Swap = () => {
  return (
    <PageWrapper className="mb-8">
      <div className="md:float-left md:w-1/2">
        <PageHeaderLeft
          subtitle=""
          title="Swap"
          caption="Swap your local stablecoins at efficient rates"
          link={{ text: 'Learn about swap', url: 'https://docs.halodao.com/get-started/how-to-earn/how-to-farm' }}
        />
      </div>
      <div className="md:float-right md:w-1/2">
        <div className="flex items-start bg-white py-6 px-8 border border-primary-hover shadow-md rounded-card">
          <div className="w-full py-4">
            <PageWarning
              caption={"Swapping is disabled while we're adding initial liquidity. It will be enabled momentarily."}
            />
          </div>
        </div>
      </div>
      <div className="hidden md:flex items-start md:w-1/2">
        <InfoCard
          title="Swap Info"
          description="Deposit your HLP tokens to the Farm to begin earning Rainbow Candies (RNBW). Each RNBW you earn is automatically staked as xRNBW in the Rainbow Pool to begin earning vesting rewards!"
        />
      </div>
    </PageWrapper>
  )
}

export default Swap
