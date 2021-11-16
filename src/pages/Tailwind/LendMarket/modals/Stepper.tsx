import React, { useState } from 'react'
import CircleIcon from 'assets/svg/gray-white-circle.svg'
import YellowCircleIcon from 'assets/svg/yellow-circle.svg'
import CompleteIcon from 'assets/svg/check-circle-icon.svg'
import DisabledIcon from 'assets/svg/circle-inside-square.svg'
import { ChainId, Token } from '@sushiswap/sdk'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import CurrencyInput from 'components/Tailwind/InputFields/CurrencyInput'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import { HALO } from '../../../../constants'
import { ArrowRight } from 'react-feather'

export enum StepperMode {
  Deposit,
  Withdraw,
  Borrow,
  Repay
}

const Stepper = ({ mode }: { mode: StepperMode }) => {
  const [approveState, setApproveState] = useState(ApproveButtonState.NotApproved)

  const DisabledContent = () => {
    return (
      <>
        <div className="border border-primary-hover mt-4 rounded-md">
          <div className="flex flex-col justify-center bg-primary-hover rounded-t-md p-4 w-full items-center">
            <div className="text-lg text-white pl-2 tracking-wide">
              {mode === StepperMode.Deposit && <span>Your balance is zero</span>}
              {mode === StepperMode.Borrow && <span>You have no collateral</span>}
            </div>
          </div>
          <div className="flex flex-col justify-center w-full items-center">
            <div className="mt-4 text-center">
              <img src={DisabledIcon} alt="Disabled..." />
            </div>
            <div className="p-8 text-center">
              {mode === StepperMode.Deposit && (
                <span>Transfer (Token) or any token into your wallet to use as collateral</span>
              )}
              {mode === StepperMode.Borrow && (
                <span>
                  If you want to borrow this or any asset, choose an asset from the main lending market page to
                  deposit/lend assets
                </span>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  const NotApprovedContent = () => {
    return (
      <>
        <div className="border border-primary-hover mt-4 rounded-md">
          <div className="flex flex-col justify-center bg-primary-hover rounded-t-md p-4 w-full">
            <div className="flex flex-row">
              <div className="w-4/5">
                <div className="text-sm text-white font-bold rounded-md pl-2 uppercase tracking-wide">Step 1</div>
                {mode === StepperMode.Deposit && (
                  <div className="text-lg text-white pl-2">Enter lend amount and approve </div>
                )}
                {mode === StepperMode.Withdraw && (
                  <div className="text-lg text-white pl-2">Enter amount to withdraw and approve </div>
                )}
                {mode === StepperMode.Borrow && (
                  <div className="text-lg text-white pl-2">Enter amount to borrow and approve </div>
                )}
                {mode === StepperMode.Repay && <div className="text-lg text-white pl-2">Enter amount and approve </div>}
              </div>
              <div className="w-1/5 flex justify-end">
                <img src={CircleIcon} width="23px" alt="In progress..." />
              </div>
            </div>
          </div>
          <div className="p-4">
            <CurrencyInput
              canSelectToken={false}
              currency={HALO[ChainId.MAINNET] as Token}
              value="0"
              didChangeValue={val => val}
              showBalance={true}
              showMax={true}
            />
          </div>
          <div className="px-4 pb-6">
            <ApproveButton
              title="Approve"
              state={ApproveButtonState.NotApproved}
              onClick={() => {
                setApproveState(ApproveButtonState.Approving)
                setTimeout(() => {
                  setApproveState(ApproveButtonState.Approved)
                }, 1000)
              }}
            />
          </div>
        </div>

        <div className="border border-primary-hover border-opacity-50 mt-4 rounded-md">
          <div className="flex flex-col justify-center bg-primary-hover rounded-t-md p-4 w-full opacity-50">
            <div className="flex flex-row">
              <div className="w-4/5 opacity-60">
                <div className="text-sm text-white font-bold rounded-md pl-2 uppercase tracking-wide">Step 2</div>
                {mode === StepperMode.Deposit && <div className="text-lg text-white pl-2">Confirm Lend</div>}
                {mode === StepperMode.Withdraw && <div className="text-lg text-white pl-2">Confirm Withdraw</div>}
                {mode === StepperMode.Borrow && <div className="text-lg text-white pl-2">Confirm Borrow </div>}
                {mode === StepperMode.Repay && <div className="text-lg text-white pl-2">Confirm Repay</div>}
              </div>
              <div className="w-1/5 flex justify-end">
                <img className="opacity-60" src={CircleIcon} width="23px" alt="In progress..." />
              </div>
            </div>
          </div>
          <div className="p-4"></div>
          <div className="px-4 pb-6">
            <PrimaryButton title="Confirm" type={PrimaryButtonType.Gradient} state={PrimaryButtonState.Disabled} />
          </div>
        </div>
      </>
    )
  }
  const InProgressContent = () => {
    return (
      <>
        <div className="border border-primary-hover mt-4 rounded-md">
          <div className="flex flex-col justify-center bg-primary-hover rounded-t-md p-4 w-full">
            <div className="flex flex-row">
              <div className="w-4/5">
                <div className="text-sm text-white font-bold rounded-md pl-2 uppercase tracking-wide">Step 1</div>
                <div className="text-lg text-white pl-2">Enter amount and approve </div>
              </div>
              <div className="w-1/5 flex justify-end">
                <img src={YellowCircleIcon} width="23px" alt="In progress..." />
              </div>
            </div>
          </div>
          <div className="p-4 flex flex-col w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="text-sm rounded-md pl-2 uppercase">Amount</div>
              <div className="text-xl font-bold pl-2">123.45 RNBW</div>
            </div>
          </div>
          <div className="px-4 pb-6">
            <ApproveButton
              title="Pendng"
              state={ApproveButtonState.Approving}
              className="bg-misc-yellow text-white"
              onClick={() => {
                console.log('clicked')
              }}
            />
          </div>
        </div>

        <div className="border border-primary-hover border-opacity-50 mt-4 rounded-md">
          <div className="flex flex-col justify-center bg-primary-hover rounded-t-md p-4 w-full opacity-50">
            <div className="flex flex-row">
              <div className="w-4/5 opacity-60">
                <div className="text-sm text-white font-bold rounded-md pl-2 uppercase tracking-wide">Step 2</div>
                {mode === StepperMode.Deposit && <div className="text-lg text-white pl-2">Confirm Lend</div>}
                {mode === StepperMode.Withdraw && <div className="text-lg text-white pl-2">Confirm Withdraw</div>}
                {mode === StepperMode.Borrow && <div className="text-lg text-white pl-2">Confirm Borrow </div>}
                {mode === StepperMode.Repay && <div className="text-lg text-white pl-2">Confirm Repay</div>}
              </div>
              <div className="w-1/5 flex justify-end">
                <img className="opacity-60" src={CircleIcon} width="23px" alt="In progress..." />
              </div>
            </div>
          </div>
          <div className="p-4"></div>
          <div className="px-4 pb-6">
            <PrimaryButton title="Confirm" type={PrimaryButtonType.Gradient} state={PrimaryButtonState.Disabled} />
          </div>
        </div>
      </>
    )
  }

  const ApprovedContent = () => {
    return (
      <>
        <div className="border border-primary-hover mt-4 rounded-md">
          <div className="flex flex-col justify-center bg-primary-hover opacity-50 rounded-t-md p-4 w-full">
            <div className="flex flex-row">
              <div className="w-4/5">
                <div className="text-sm text-white font-bold rounded-md pl-2 uppercase tracking-wide">Step 1</div>
                <div className="text-lg text-white pl-2">Enter amount and approve </div>
              </div>
              <div className="w-1/5 flex justify-end">
                <img src={CompleteIcon} width="23px" alt="Completed..." />
              </div>
            </div>
          </div>
          <div className="p-4 flex flex-col w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="text-sm rounded-md pl-2 uppercase">Amount</div>
              <div className="text-xl font-bold pl-2">123.45 RNBW</div>
              <div className="text-xs rounded-md pl-2 uppercase">
                Value in USD <span className="font-semibold"> $100</span>
              </div>
            </div>
          </div>
          <div className="px-4 pb-6">
            <ApproveButton
              title="Approved"
              state={ApproveButtonState.Approved}
              onClick={() => console.log('clicked')}
            />
          </div>
        </div>

        <div className="border border-primary-hover mt-4 rounded-md">
          <div className="flex flex-col justify-center bg-primary-hover rounded-t-md p-4 w-full">
            <div className="flex flex-row">
              <div className="w-4/5">
                <div className="text-sm text-white font-bold rounded-md pl-2 uppercase tracking-wide">Step 2</div>
                {mode === StepperMode.Deposit && <div className="text-lg text-white pl-2">Confirm Lend</div>}
                {mode === StepperMode.Withdraw && <div className="text-lg text-white pl-2">Confirm Withdraw</div>}
                {mode === StepperMode.Borrow && <div className="text-lg text-white pl-2">Confirm Borrow </div>}
                {mode === StepperMode.Repay && <div className="text-lg text-white pl-2">Confirm Repay</div>}
              </div>
              <div className="w-1/5 flex justify-end">
                <img className="opacity-60" src={CircleIcon} width="23px" alt="In progress..." />
              </div>
            </div>
          </div>
          <div className="p-4">
            {mode === StepperMode.Withdraw && (
              <div className="flex flex-col items-start justify-center">
                <div>You are withdrawing</div>
                <div className="text-xl">123.45 RNBW</div>
                <div className="border-b border-gray-600 mt-1 mb-1 w-full"></div>
                <div className="flex flex-row w-full mb-1">
                  <div className="text-sm text-gray-600 w-3/4 flex">Remaining Balance</div>
                  <div className="text-sm text-gray-600 w-1/4">
                    <span className="flex justify-end">$100</span>
                  </div>
                </div>
                <div className="flex flex-row w-full">
                  <div className="text-sm text-gray-600 w-3/4 flex">Health Factor</div>
                  <div className="text-sm text-gray-600 w-1/4">
                    <span className="flex justify-end">
                      0%{' '}
                      <span className="align-center pl-1 pr-1">
                        {' '}
                        <ArrowRight size={14} />{' '}
                      </span>{' '}
                      0%
                    </span>
                  </div>
                </div>
              </div>
            )}
            {mode === StepperMode.Borrow && (
              <div className="flex flex-col items-start justify-center">
                <div>You are borrowing</div>
                <div className="text-xl">123.45 RNBW</div>
                <div className="border-b border-gray-600 mt-1 mb-1 w-full"></div>
                <div className="flex flex-row w-full mb-1">
                  <div className="text-sm text-gray-600 w-3/4 flex">Borrow APY</div>
                  <div className="text-sm text-gray-600 w-1/4">
                    <span className="flex justify-end">100%</span>
                  </div>
                </div>
                <div className="flex flex-row w-full mb-1">
                  <div className="text-sm text-gray-600 w-3/4 flex">Borrow Balance</div>
                  <div className="text-sm text-gray-600 w-1/4">
                    <span className="flex justify-end">$100</span>
                  </div>
                </div>
                <div className="flex flex-row w-full mb-1">
                  <div className="text-sm text-gray-600 w-3/4 flex">Borrow Limit Used</div>
                  <div className="text-sm text-gray-600 w-1/4">
                    <span className="flex justify-end">0%</span>
                  </div>
                </div>
                <div className="flex flex-row w-full">
                  <div className="text-sm text-gray-600 w-3/4 flex">Health Factor</div>
                  <div className="text-sm text-gray-600 w-1/4">
                    <span className="flex justify-end">
                      0%{' '}
                      <span className="align-center pl-1 pr-1">
                        {' '}
                        <ArrowRight size={14} />{' '}
                      </span>{' '}
                      0%
                    </span>
                  </div>
                </div>
              </div>
            )}
            {mode === StepperMode.Repay && (
              <div className="flex flex-col items-start justify-center">
                <div>You are repaying</div>
                <div className="text-xl">123.45 RNBW</div>
                <div className="border-b border-gray-600 mt-1 mb-1 w-full"></div>
                <div className="flex flex-row w-full mb-1">
                  <div className="text-sm text-gray-600 w-3/4 flex">Remaining Balance</div>
                  <div className="text-sm text-gray-600 w-1/4">
                    <span className="flex justify-end">$100</span>
                  </div>
                </div>
                <div className="flex flex-row w-full">
                  <div className="text-sm text-gray-600 w-3/4 flex">Health Factor</div>
                  <div className="text-sm text-gray-600 w-1/4">
                    <span className="flex justify-end">
                      0%{' '}
                      <span className="align-center pl-1 pr-1">
                        {' '}
                        <ArrowRight size={14} />{' '}
                      </span>{' '}
                      0%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="px-4 pb-6">
            <PrimaryButton title="Confirm" type={PrimaryButtonType.Gradient} state={PrimaryButtonState.Enabled} />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* @todo display disabledContent if balance or collateral = 0 
      <DisabledContent />
      */}
      {approveState === ApproveButtonState.NotApproved && <NotApprovedContent />}
      {approveState === ApproveButtonState.Approving && <InProgressContent />}
      {approveState === ApproveButtonState.Approved && <ApprovedContent />}
    </>
  )
}

export default Stepper
