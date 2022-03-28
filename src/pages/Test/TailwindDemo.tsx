import React, { useState } from 'react'
import ExpandablePoolRow from 'components/Tailwind/Templates/ExpandablePoolRow'
import PageHeaderLeft from 'components/Tailwind/Layout/PageHeaderLeft'
import PageWrapper from 'components/Tailwind/Layout/PageWrapper'
import PoolColumns from 'components/Tailwind/Templates/PoolColumns'
import PageHeaderRight from 'components/Tailwind/Templates/PageHeaderRight'
import PoolExpandButton from 'components/Tailwind/Buttons/PoolExpandButton'
import PoolBigButton from 'components/Tailwind/Buttons/PoolBigButton'
import TabsControl from 'components/Tailwind/SegmentControl/TabsControl'
import SegmentControl from 'components/Tailwind/SegmentControl/SegmentControl'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import MaxButton from 'components/Tailwind/Buttons/MaxButton'
import { ChainId } from '@halodao/sdk'
import { HALO } from '../../constants'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import SlippageTolerance from 'components/Tailwind/InputFields/SlippageTolerance'
import AmountSlider from 'components/Tailwind/InputFields/AmountSlider'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import BaseModal from 'components/Tailwind/Modals/BaseModal'
import InlineErrorContent from 'components/Tailwind/ErrorContent/InlineErrorContent'

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

  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [activeSegment, setActiveSegment] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [amount, setAmount] = useState(100)
  const [showModal, setShowModal] = useState(false)
  const [slippage, setSlippage] = useState('3')

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
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:items-center">
          {/* Left side */}
          <div className="md:w-1/2 md:pr-16">
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

      {/* =========================== */}
      {/* ===== Button Elements ===== */}
      {/* =========================== */}
      <PageWrapper className="mb-8">
        <div className="text-xl font-bold">Buttons</div>
        <div className="flex mb-4">
          <div className="w-1/3">Pool expand/close button</div>
          <div className="w-1/3">
            <p>Collapsed</p>
            <PoolExpandButton
              title="Manage"
              expandedTitle="Close"
              isExpanded={isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>
          <div className="w-1/3">
            <p>Expanded</p>
            <PoolExpandButton
              title="Manage"
              expandedTitle="Close"
              isExpanded={!isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>
        </div>
        <div className="flex mb-4">
          <div className="w-1/3">Pool big button</div>
          <div className="w-1/3">
            <p>Enabled</p>
            <PoolBigButton title="Stake" isEnabled={true} onClick={() => console.log('clicked')} />
          </div>
          <div className="w-1/3">
            <p>Disabled</p>
            <PoolBigButton title="Harvest" isEnabled={false} onClick={() => console.log('clicked')} />
          </div>
        </div>
        <div className="flex mb-4">
          <div className="w-1/3">Max button</div>
          <div className="w-1/3">
            <p>Enabled</p>
            <MaxButton title="Max" isEnabled={true} onClick={() => console.log('clicked')} />
          </div>
          <div className="w-1/3">
            <p>Disabled</p>
            <MaxButton title="Max" isEnabled={false} onClick={() => console.log('clicked')} />
          </div>
        </div>
        <div className="flex mb-4 space-x-8">
          <div className="w-1/4">Approve button</div>
          <div className="w-1/4">
            <p>Not Approved</p>
            <ApproveButton
              title="Approve"
              state={ApproveButtonState.NotApproved}
              onClick={() => console.log('clicked')}
            />
          </div>
          <div className="w-1/4">
            <p>Approving</p>
            <ApproveButton
              title="Approving"
              state={ApproveButtonState.Approving}
              onClick={() => console.log('clicked')}
            />
          </div>
          <div className="w-1/4">
            <p>Approved</p>
            <ApproveButton
              title="Approved"
              state={ApproveButtonState.Approved}
              onClick={() => console.log('clicked')}
            />
          </div>
        </div>
        <div className="flex space-x-8 mb-4">
          <div className="w-1/4">Primary button (Default)</div>
          <div className="w-1/4">
            <p>Enabled</p>
            <PrimaryButton
              title="Remove Supply"
              state={PrimaryButtonState.Enabled}
              onClick={() => console.log('clicked')}
            />
          </div>
          <div className="w-1/4">
            <p>Disabled</p>
            <PrimaryButton
              title="Remove Supply"
              state={PrimaryButtonState.Disabled}
              onClick={() => console.log('clicked')}
            />
          </div>
          <div className="w-1/4">
            <p>Loading</p>
            <PrimaryButton
              title="Removing"
              state={PrimaryButtonState.InProgress}
              onClick={() => console.log('clicked')}
            />
          </div>
        </div>
        <div className="flex space-x-8 mb-4">
          <div className="w-1/4">Primary button (Gradient)</div>
          <div className="w-1/4">
            <p>Enabled</p>
            <PrimaryButton
              type={PrimaryButtonType.Gradient}
              title="Supply"
              state={PrimaryButtonState.Enabled}
              onClick={() => console.log('clicked')}
            />
          </div>
          <div className="w-1/4">
            <p>Disabled / Error</p>
            <PrimaryButton
              type={PrimaryButtonType.Gradient}
              title="Enter an amount"
              state={PrimaryButtonState.Disabled}
              onClick={() => console.log('clicked')}
            />
            <div className="mt-2">
              <PrimaryButton
                type={PrimaryButtonType.Gradient}
                title="Insufficient Balance"
                state={PrimaryButtonState.Disabled}
                onClick={() => console.log('clicked')}
              />
            </div>
          </div>
          <div className="w-1/4">
            <p>Loading</p>
            <PrimaryButton
              type={PrimaryButtonType.Gradient}
              title="Confirming"
              state={PrimaryButtonState.InProgress}
              onClick={() => console.log('clicked')}
            />
          </div>
        </div>
      </PageWrapper>

      {/* ============================ */}
      {/* ===== Control Elements ===== */}
      {/* ============================ */}
      <PageWrapper className="mb-8">
        <div className="text-xl font-bold">UI Controls</div>
        <div className="flex mb-4">
          <div className="w-1/2">Tabs Control</div>
          <div className="w-1/2">
            <TabsControl tabs={['Tab 1', 'Tab 2', 'Tab 3']} activeTab={activeTab} didChangeTab={i => setActiveTab(i)} />
          </div>
        </div>
        <div className="flex">
          <div className="w-1/2">Segment Control</div>
          <div className="w-1/2">
            <SegmentControl
              segments={['Segment 1', 'Segment 2']}
              activeSegment={activeSegment}
              didChangeSegment={i => setActiveSegment(i)}
            />
          </div>
        </div>
      </PageWrapper>

      {/* ======================== */}
      {/* ===== Input Fields ===== */}
      {/* ======================== */}
      <PageWrapper className="mb-8">
        <div className="text-xl font-bold">Input Fields</div>
        <div className="flex space-x-8 mb-4">
          <div className="w-1/6">Token input</div>
          <div className="flex-1">
            <p>Default</p>
            <CurrencyInput
              currency={HALO[ChainId.MAINNET]!} // eslint-disable-line
              value={inputValue}
              canSelectToken={false}
              didChangeValue={val => setInputValue(val)}
              showBalance={true}
              showMax={true}
            />
          </div>
          <div className="flex-1">
            <p>Hide balance & max</p>
            <CurrencyInput
              currency={HALO[ChainId.MAINNET]!} // eslint-disable-line
              value={inputValue}
              canSelectToken={false}
              didChangeValue={val => setInputValue(val)}
              showBalance={false}
              showMax={false}
            />
          </div>
        </div>
        <div className="flex space-x-8 mb-4">
          <div className="w-1/2">Slippage tollerance</div>
          <div className="w-1/2">
            <SlippageTolerance
              value={slippage}
              didChangeValue={(newSlippage: string) => {
                setSlippage(newSlippage)
              }}
            />
          </div>
        </div>
        <div className="flex space-x-8 mb-4">
          <div className="w-1/2">Amount Slider</div>
          <div className="w-1/2">
            <AmountSlider amount={amount} didChangeAmount={amt => setAmount(amt)} />
          </div>
        </div>
      </PageWrapper>

      {/* ================== */}
      {/* ===== Modals ===== */}
      {/* ================== */}
      <PageWrapper className="mb-8">
        <div className="text-xl font-bold">Modals</div>
        <BaseModal isVisible={showModal} canBlur={true} onDismiss={() => setShowModal(false)}>
          <div className="p-4">
            <div className="mb-2">Hello!</div>
            <div>This is a base modal meant to be extended as a new component.</div>
          </div>
        </BaseModal>
        <button onClick={() => setShowModal(true)}>Show modal</button>
      </PageWrapper>

      {/* ================== */}
      {/* ===== Errors ===== */}
      {/* ================== */}
      <PageWrapper className="mb-8">
        <div className="text-xl font-bold">Inline Error</div>
        <InlineErrorContent errorObject={{ code: 12345, message: 'This is a sample error' }} />
      </PageWrapper>
    </>
  )
}

export default TailwindDemo
