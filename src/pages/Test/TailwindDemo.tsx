import React from 'react'
import ExpandablePoolRow from 'components/Tailwind/Templates/ExpandablePoolRow'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PoolColumns from 'components/Tailwind/Templates/PoolColumns'
import PageHeaderRight from 'components/Tailwind/Templates/PageHeaderRight'

const TailwindDemo = () => {
  const pools = [
    {
      name: 'RNBW/USDT',
      tokenA: { bal: 1800, symbol: 'RNBW' },
      tokenB: { bal: 650, symbol: 'USDT' },
      held: 0,
      staked: 2000,
      earned: 0
    },
    {
      name: 'XSGD/USDT',
      tokenA: { bal: 3000, symbol: 'XSGD' },
      tokenB: { bal: 100, symbol: 'USDT' },
      held: 100,
      staked: 0,
      earned: 10.12345
    },
    {
      name: 'XSGD/USDC',
      tokenA: { bal: 100, symbol: 'XSGD' },
      tokenB: { bal: 100, symbol: 'USDC' },
      held: 0,
      staked: 100,
      earned: 0
    }
  ]

  return (
    <>
      <PageWrapper className="mb-8">
        <div className="text-2xl font-extrabold">Tailwind Components</div>
      </PageWrapper>

      {/* ======================== */}
      {/* ===== Page Wrapper ===== */}
      {/* ======================== */}
      <PageWrapper className="bg-yellow-50 mb-8">
        <div className="p-8">
          <div className="text-xl font-bold">Page Wrapper</div>
          <p>Max-width 1024px with min 2rem margins on tablets (1 rem on mobile), centered on wider screeens.</p>
        </div>
      </PageWrapper>

      {/* ======================= */}
      {/* ===== Page Header ===== */}
      {/* ======================= */}
      <PageWrapper className="mb-8">
        <div className="text-xl font-bold">Page header</div>
        <p>- with 1rem (16px) space between on mobile</p>
        <p>- with 4rem (64px) space between on desktop</p>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-16 md:items-center">
          <div className="p-8 bg-yellow-50 md:w-1/2">Left (mobile: 100%, desktop: 1/2 screen)</div>
          <div className="p-8 bg-yellow-50 md:w-1/2">Right (mobile: 100%, desktop: 1/2 screen)</div>
        </div>
      </PageWrapper>

      {/* ================================ */}
      {/* ===== Page Header (Filled) ===== */}
      {/* ================================ */}
      <PageWrapper className="mb-8">
        <div className="text-xl font-bold">Page header (filled)</div>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-16 md:items-center">
          {/* Left side */}
          <div className="md:w-1/2">
            <PageHeaderLeft
              subtitle="Add/Remove Liquidity"
              title="Pools"
              caption="ERC721 token standard returns a immutable raiden network! VeChain should be a ERC20 token standard!"
              link={{ text: 'Learn about pool liquidity', url: 'https://docs.halodao.com' }}
            />
          </div>
          {/* Right side */}
          <div className="md:w-1/2">
            <PageHeaderRight />
          </div>
        </div>
      </PageWrapper>

      {/* ====================== */}
      {/* ===== Pool Table ===== */}
      {/* ====================== */}
      <PageWrapper className="mb-8">
        <div className="text-xl font-bold">Pool table</div>
        <PoolColumns />
        {pools.map(pool => (
          <ExpandablePoolRow key={pool.name} pool={pool} />
        ))}
      </PageWrapper>
    </>
  )
}

export default TailwindDemo
